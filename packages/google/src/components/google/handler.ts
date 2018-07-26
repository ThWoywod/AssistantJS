import { ApiAiHandler, DialogflowInterface } from "assistant-apiai";
import {
  AuthenticationMixin,
  CardMixin,
  ChatBubblesMixin,
  injectionNames,
  MinimalRequestExtraction,
  RepromptsMixin,
  RequestContext,
  ResponseHandlerExtensions,
  SessionDataMixin,
  SuggestionChipsMixin,
} from "assistant-source";
import { inject, injectable } from "inversify";
import { DialogflowResponse } from "./conversation-interface/dialogflow-response";
import { GoogleInterface, GoogleSpecificHandable, GoogleSpecificTypes } from "./public-interfaces";

@injectable()
export class GoogleHandler<CustomTypes extends GoogleSpecificTypes>
  extends AuthenticationMixin(CardMixin(ChatBubblesMixin(RepromptsMixin(SessionDataMixin(SuggestionChipsMixin(ApiAiHandler))))))<CustomTypes>
  implements GoogleSpecificHandable<CustomTypes> {
  constructor(
    @inject(injectionNames.current.requestContext) requestContext: RequestContext,
    @inject(injectionNames.current.extraction) extraction: MinimalRequestExtraction,
    @inject(injectionNames.current.killSessionService) killSession: () => Promise<void>,
    @inject(injectionNames.current.responseHandlerExtensions)
    responseHandlerExtensions: ResponseHandlerExtensions<CustomTypes, GoogleSpecificHandable<CustomTypes>>
  ) {
    super(requestContext, extraction, killSession, responseHandlerExtensions);
  }

  public getBody(results: Partial<CustomTypes>): DialogflowInterface.WebhookResponse<DialogflowResponse> {
    // Grab response for api.ai with empty results, so that no fullfilment texts are added
    const response: DialogflowInterface.WebhookResponse<Partial<DialogflowResponse>> = super.getBody({});

    let googlePayload: Partial<DialogflowResponse["google"]> = {};

    [this.fillPrompt, this.fillEndSession, this.fillAuthentication, this.fillCard, this.fillReprompts, this.fillSessionData, this.fillSuggestionChips].forEach(
      (fn: (results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>) => Partial<DialogflowResponse["google"]>) => {
        googlePayload = fn.bind(this)(results, googlePayload);
      }
    );

    // tslint:disable-next-line:no-object-literal-type-assertion
    response.payload = { google: googlePayload } as DialogflowResponse;

    return response as DialogflowInterface.WebhookResponse<DialogflowResponse>;
  }

  private fillEndSession(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    payload.expectUserResponse = !results.shouldSessionEnd; // to convert optional undefined to boolean

    return payload;
  }

  private fillAuthentication(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    if (results.shouldAuthenticate) {
      payload.systemIntent = {
        intent: "actions.intent.SIGN_IN",
        data: {},
      };
    }
    return payload;
  }

  private fillCard(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    if (results.card) {
      if (!payload.richResponse) {
        payload.richResponse = this.createRichResponse();
      }

      payload.richResponse.items!.push({
        basicCard: {
          title: results.card.title,
          subtitle: results.card.subTitle || undefined,
          formattedText: results.card.description,
          image: results.card.cardImage
            ? { url: results.card.cardImage, accessibilityText: results.card.cardAccessibilityText || results.card.description }
            : undefined,
        },
      });
    }

    return payload;
  }

  private fillPrompt(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    const currentPayload = payload;

    if (results.voiceMessage) {
      if (!currentPayload.richResponse) {
        currentPayload.richResponse = this.createRichResponse();
      }

      // first chatbubble is for voiceMessage
      if (results.chatBubbles && results.chatBubbles.length > 0) {
        results.chatBubbles.forEach((value, index, values) => {
          let currentItem: GoogleInterface.Item;

          if (index === 0) {
            currentItem = { simpleResponse: this.createSimpleResponse(results.voiceMessage!, value) };
          } else if (index === 1) {
            const remainingElements = values.splice(1).join(" ");
            currentItem = { simpleResponse: this.createSimpleResponse(remainingElements, remainingElements) };
          } else {
            return;
          }

          currentPayload.richResponse!.items!.push(currentItem);
        });
      } else {
        const currentItem = { simpleResponse: this.createSimpleResponse(results.voiceMessage) };
        currentPayload.richResponse.items!.push(currentItem);
      }
    } else if (results.chatBubbles && results.chatBubbles.length > 0) {
      if (!currentPayload.richResponse) {
        currentPayload.richResponse = this.createRichResponse();
      }

      results.chatBubbles.forEach((value, index) => {
        let currentItem: GoogleInterface.Item;

        currentItem = currentItem = { simpleResponse: this.createSimpleResponse(value) };

        currentPayload.richResponse!.items!.push(currentItem);
      });
    }

    return currentPayload;
  }

  private fillReprompts(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    if (results.reprompts && results.reprompts.length > 0) {
      payload.noInputPrompts = results.reprompts!.map(value => this.createSimpleResponse(value));
    }

    return payload;
  }

  private fillSessionData(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    // Add session data
    if (results.sessionData) {
      payload.userStorage = results.sessionData;
    }

    return payload;
  }

  private fillSuggestionChips(results: Partial<CustomTypes>, payload: Partial<DialogflowResponse["google"]>): Partial<DialogflowResponse["google"]> {
    if (results.suggestionChips && results.suggestionChips.length > 0 && !results.shouldSessionEnd) {
      if (!payload.richResponse) {
        payload.richResponse = this.createRichResponse();
      }

      payload.richResponse.suggestions = results.suggestionChips.map(chip => {
        return {
          title: chip,
        };
      });
    }

    return payload;
  }

  private createRichResponse(): GoogleInterface.RichResponse {
    return {
      items: [],
    };
  }

  private createSimpleResponse(voiceMessage: CustomTypes["voiceMessage"] | string, displayText?: string): GoogleInterface.SimpleResponse {
    let result: GoogleInterface.SimpleResponse;
    if (typeof voiceMessage !== "string") {
      result = voiceMessage.isSSML
        ? {
            ssml: voiceMessage.text,
          }
        : {
            textToSpeech: voiceMessage.text,
          };
    } else {
      result = {
        textToSpeech: voiceMessage,
      };
    }

    if (displayText) {
      result.displayText = displayText;
    }

    return result;
  }
}
