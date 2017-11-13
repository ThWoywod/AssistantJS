import { inject, injectable } from "inversify";
import { unifierInterfaces, rootInterfaces, AbstractResponseHandler } from "assistant-source"
import { ApiAiHandle } from "assistant-apiai";
import { HandlerInterface, GoogleWebhook } from "./interfaces";
import { log } from "../../global";
import { Component } from "inversify-components";

@injectable()
export class GoogleHandle extends ApiAiHandle implements HandlerInterface {
  responseCallback: rootInterfaces.ResponseCallback;

  isSSML: boolean = false;
  forceAuthenticated: boolean = false;

  suggestionChips: string[] | null = null;
  reprompts: string[] | null = null;

  cardTitle: string | null = null;
  cardBody: string | null = null;
  cardImage: string | null = null;
  
  constructor(
    @inject("core:root:current-request-context") extraction: rootInterfaces.RequestContext,
    @inject("core:unifier:current-kill-session-promise") killSession: () => Promise<void>,
    @inject("meta:component//apiai") componentMeta: Component
  ) {
    super(extraction, killSession, componentMeta);
  }

  sendResponse() {
    if (this.forceAuthenticated) {
      if (this.voiceMessage === "" || typeof this.voiceMessage === "undefined") 
        throw new Error("Since there is no auto handling, you have to pass a voice message in order to use 'forceAuthenticated' on google assistant");
      
      this.endSession = true;
    }

    super.sendResponse();
  }

  getBody() {
    // Validation: Check if there is a voice message if sign in is forced
    if (this.forceAuthenticated) {
      if (this.voiceMessage === "" || typeof this.voiceMessage === "undefined") 
        throw new Error("Since there is no auto handling, you have to pass a voice message in order to use 'forceAuthenticated' on google assistant");
    }

    // Grab response for api.ai
    let apiAiResponse = super.getBody();
    
    // Create basic data object
    let googleData: GoogleWebhook.Response = {
      "expectUserResponse": !this.endSession,
      "isSsml": this.isSSML
    }

    // Add reprompts
    if (this.reprompts !== null && this.reprompts.length > 0) {
      googleData.noInputPrompts = this.reprompts.map(reprompt => this.buildSimpleResponse(this.detectIfSSML(reprompt), reprompt));
    }

    // Add sign in requirement if wanted
    if (this.forceAuthenticated) {
      googleData.systemIntent = {
        "intent": "actions.intent.SIGN_IN",
        "inputValueData": {}
      };
    }

    // If we are not using any special fields, just use the "speech" attribute
    if (this.cardBody === null && this.reprompts === null && this.suggestionChips === null && this.cardTitle === null) {
      googleData.speech = apiAiResponse.speech;
    } else {
      // Create response object
      let richResponse: GoogleWebhook.Response.Rich = {
        "items": []
      }

      // Add suggestion chips if used
      if (this.suggestionChips !== null && this.suggestionChips.length > 0) {
        richResponse.suggestions = this.suggestionChips.map(suggestion => { return { "title": suggestion } });
      }

      // Add first simpleResponse object
      let mainResponse = this.buildSimpleResponse(this.isSSML, apiAiResponse.speech);
      mainResponse.displayText = this.chatBubbles !== null && this.chatBubbles.length >= 1 ? this.chatBubbles[0] : apiAiResponse.speech;
      richResponse.items.push({"simpleResponse": mainResponse});

      // Add possible second simpleResponse object
      if (this.chatBubbles !== null && this.chatBubbles.length >= 2) {
        let secondResponse: GoogleWebhook.Response.Simple = { displayText: this.chatBubbles[1] };
        richResponse.items.push({"simpleResponse": secondResponse});
      }

      // Add possible card
      if (this.cardBody !== null && this.cardTitle !== null) {
        let cardResponse: GoogleWebhook.Response.Card.Basic = { title: this.cardTitle, formattedText: this.cardBody };
        if (this.cardImage !== null) cardResponse.image = { url: this.cardImage, accessibilityText: this.cardBody };
        richResponse.items.push({"basicCard": cardResponse});
      }

      // Bind response object to finalResponse or richResponse, depending of the value of this.endSession
      if (this.endSession) {
        googleData.finalResponse = { "richResponse": richResponse };
      } else {
        googleData.richResponse = richResponse;
      }
    }

    // Create body by merging api ai response with goole data info
    const body = Object.assign({}, apiAiResponse, { "data": { "google": googleData } });
    return body;
  }

  /** Returns true if given string is ssml, so is wrapped in <speak></speak> tags */
  private detectIfSSML(string: string) {
    return string.trim().startsWith("<speak>");
  }

  /** Builds a simple response which uses displayText as voiceMessage. */
  private buildSimpleResponse(isSSML: boolean, string?: string) {
    let response: GoogleWebhook.Response.Simple = {};
    response.displayText = string;
    Object.assign(response, isSSML ? { "ssml": string } : { "textToSpeech": string });
    return response;
  }
}