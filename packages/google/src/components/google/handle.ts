import { inject, injectable } from "inversify";
import { unifierInterfaces, rootInterfaces, AbstractResponseHandler } from "assistant-source"
import { ApiAiHandle } from "assistant-apiai";
import { HandlerInterface } from "./interfaces";
import { log } from "../../global";

@injectable()
export class GoogleHandle extends ApiAiHandle implements HandlerInterface {
  responseCallback: rootInterfaces.ResponseCallback;

  isSSML: boolean = false;
  forceAuthenticated: boolean = false;
  
  constructor(
    @inject("core:root:current-request-context") extraction: rootInterfaces.RequestContext,
    @inject("core:unifier:current-kill-session-promise") killSession: Function
  ) {
    super(extraction, killSession);
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
    let body = super.getBody();
    log("Responding with ", body);

    return body;
  }

  protected getBaseBody(): any {
    return {
      data: {
        response: {
          shouldEndSession: this.endSession
        },
        google: {
          expectUserResponse: !this.endSession,
          isSsml: this.isSSML
        }
      }
    };
  }
}