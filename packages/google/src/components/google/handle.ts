import { ApiAiHandler, webhookInterface } from "assistant-apiai";
import { injectionNames, RequestContext, ResponseHandlerExtensions } from "assistant-source";
import { inject, injectable } from "inversify";
import { GoogleSpecificHandable, GoogleSpecificTypes, GoogleWebhook } from "./public-interfaces";

@injectable()
export class GoogleHandler<CustomTypes extends GoogleSpecificTypes> extends ApiAiHandler<CustomTypes> implements GoogleSpecificHandable<CustomTypes> {
  public readonly specificWhitelist = ["getSessionData", "setSessionData"];

  constructor(
    @inject(injectionNames.current.requestContext) extraction: RequestContext,
    @inject(injectionNames.current.killSessionService) killSession: () => Promise<void>,
    @inject(injectionNames.current.responseHandlerExtensions)
    responseHandlerExtensions: ResponseHandlerExtensions<CustomTypes, GoogleSpecificHandable<CustomTypes>>
  ) {
    super(extraction, killSession, responseHandlerExtensions);
  }

  public getBody(results: Partial<CustomTypes>): webhookInterface.ResponseBody {
    // Validation: Check if there is a voice message if sign in is forced
    if (results.shouldAuthenticate) {
      if (!results.voiceMessage || !results.voiceMessage.text) {
        throw new Error("Since there is no auto handling, you have to pass a voice message in order to use 'forceAuthenticated' on google assistant");
      }
    }

    // Grab response for api.ai
    const apiAiResponse = super.getBody(results);

    // Create basic data object
    const googleData: GoogleWebhook.Response = {
      expectUserResponse: !results.shouldSessionEnd,
      isSsml: !!(results.voiceMessage && results.voiceMessage.isSSML),
    };

    // Add session data
    if (results.sessionData !== null) {
      googleData.userStorage = results.sessionData;
    }

    // Add reprompts
    if (results.reprompts && results.reprompts.length > 0) {
      googleData.noInputPrompts = results.reprompts.map(reprompt => this.buildSimpleResponse(reprompt.isSSML, reprompt.text));
    }

    // Decide the kind of response: forceAuthenticated, simple, rich?
    if (results.shouldAuthenticate) {
      // Forcing token authentication is currently impossible, see also
      // https://stackoverflow.com/questions/47393868/reject-oauth-token-with-google-assistant-and-dialogflow
      // Let's just send a simple response with endSession = true instead, so developers can tell their users to relink
      // their account on their own.
      googleData.speech = apiAiResponse.fulfillmentText;
      googleData.expectUserResponse = false;
    } else if (!results.card && !results.reprompts && !results.suggestionChips) {
      // If we are not using any special fields, just use the "speech" attribute
      googleData.speech = apiAiResponse.fulfillmentText;
    } else {
      // Create response object
      const richResponse: GoogleWebhook.Response.Rich = {
        items: [],
      };

      // Add suggestion chips if used
      if (results.suggestionChips && results.suggestionChips.length > 0) {
        richResponse.suggestions = results.suggestionChips.map(suggestion => {
          return { title: suggestion.displayText };
        });
      }

      if (results.voiceMessage) {
        // Add first simpleResponse object
        const mainResponse = this.buildSimpleResponse(results.voiceMessage.isSSML, apiAiResponse.fulfillmentText);
        mainResponse.displayText = results.chatBubbles && results.chatBubbles.length >= 1 ? results.chatBubbles[0] : apiAiResponse.fulfillmentText;
        richResponse.items.push({ simpleResponse: mainResponse });
      }

      // Add possible second simpleResponse object
      if (results.chatBubbles && results.chatBubbles.length >= 2) {
        const secondResponse: GoogleWebhook.Response.Simple = { displayText: results.chatBubbles[1] };
        richResponse.items.push({ simpleResponse: secondResponse });
      }

      // Add possible card
      if (results.card) {
        const cardResponse: GoogleWebhook.Response.Card.Basic = { title: results.card.title, formattedText: results.card.description };
        if (results.card.cardImage) {
          cardResponse.image = { url: results.card.cardImage, accessibilityText: results.card.cardAccessibilityText || results.card.description };
        }
        richResponse.items.push({ basicCard: cardResponse });
      }

      // Bind response object to finalResponse or richResponse, depending of the value of this.endSession
      if (results.shouldSessionEnd) {
        googleData.finalResponse = { richResponse };
      } else {
        googleData.richResponse = richResponse;
      }
    }

    // Create body by merging api ai response with goole data info
    const body = { ...apiAiResponse, data: { google: googleData } };
    return body;
  }

  /** Builds a simple response which uses displayText as voiceMessage. */
  private buildSimpleResponse(isSSML: boolean, string?: string) {
    const response: GoogleWebhook.Response.Simple = {};
    response.displayText = string;
    Object.assign(response, isSSML ? { ssml: string } : { textToSpeech: string });
    return response;
  }
}
