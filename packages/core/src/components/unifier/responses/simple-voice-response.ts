import { MinimalResponseHandler, Voiceable, OptionalHandlerFeatures } from "../interfaces";
import { BaseResponse } from "./base-response";

export class SimpleVoiceResponse extends BaseResponse implements Voiceable {
  handler: MinimalResponseHandler & OptionalHandlerFeatures.Reprompt;

  constructor(handler: MinimalResponseHandler) {
    super(handler);
  }

  endSessionWith(text: string) {
    this.handler.endSession = true;
    this.handler.voiceMessage = this.prepareText(text);
    this.handler.sendResponse();
  }

  prompt(text: string, ...reprompts: string[]) {
    this.handler.endSession = false;
    this.handler.voiceMessage = this.prepareText(text);
    this.attachRepromptsIfAny(reprompts);
    this.handler.sendResponse();
  }

  /** Attaches reprompts to handler */
  protected attachRepromptsIfAny(reprompts: string[] = []) {
    if (reprompts.length > 0) {
      this.reportIfUnavailable(OptionalHandlerFeatures.FeatureChecker.Reprompt, "The currently used platform does not support reprompting.");
      this.handler.reprompts = reprompts.map(reprompt => this.prepareText(reprompt));
    }
  }

  /** Easy overwrite functionality for text preprocessing */
  protected prepareText(text: string) {
    return text;
  }
}