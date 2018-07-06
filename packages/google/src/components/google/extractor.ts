import { RequestExtractor, RequestContext, injectionNames, Logger, ComponentSpecificLoggerFactory } from "assistant-source";
import { Extractor as ApiAiExtractor } from "assistant-apiai";
import { injectable, inject, optional } from "inversify";
import { Component } from "inversify-components";

import { Extraction, Device } from "./public-interfaces";
import { COMPONENT_NAME } from "./private-interfaces";

@injectable()
export class Extractor extends ApiAiExtractor implements RequestExtractor {
  googleComponent: Component;
  private rootLogger: Logger;

  constructor(
    @inject("meta:component//google") googleComponent: Component,
    @inject(injectionNames.componentSpecificLoggerFactory) loggerFactory: ComponentSpecificLoggerFactory,
    @optional()
    @inject("meta:component//apiai")
    componentMeta?: Component<any>
  ) {
    if (typeof componentMeta === "undefined")
      throw new Error("Could not find api.ai component. You cannot use the google assistant platform without 'assistant-apiai'!");
    super(componentMeta, loggerFactory);

    this.rootLogger = loggerFactory(COMPONENT_NAME, "root");
    this.googleComponent = googleComponent;
  }

  async fits(context: RequestContext) {
    let apiAiFits = await super.fits(context);
    if (!apiAiFits) return false;

    this.rootLogger.debug({ requestId: context.id }, "Requests fits for dialogflow, now checking if all needed google data is contained.");

    return (
      typeof context.body.originalRequest !== "undefined" &&
      typeof context.body.originalRequest.data !== "undefined" &&
      typeof context.body.originalRequest.data.surface !== "undefined" &&
      typeof context.body.originalRequest.data.surface.capabilities !== "undefined"
    );
  }

  async extract(context: RequestContext): Promise<Extraction> {
    this.rootLogger.info({ requestId: context.id }, "Extracting request on google platform... blablabla");
    let apiAiExtraction = await super.extract(context);

    return Object.assign(apiAiExtraction, {
      platform: this.googleComponent.name,
      sessionData: this.getSessionData(context),
      oAuthToken: this.getOAuthToken(context),
      temporalAuthToken: this.getTemporalToken(context),
      device: this.getDevice(context),
    });
  }

  protected getDevice(context: RequestContext): Device {
    const capabilities = context.body.originalRequest.data.surface.capabilities;
    return capabilities.map(c => c.name).indexOf("actions.capability.SCREEN_OUTPUT") === -1 ? "speaker" : "phone";
  }

  protected getOAuthToken(context: RequestContext): string | null {
    const oAuthMock = process.env.FORCED_GOOGLE_OAUTH_TOKEN;

    if (typeof oAuthMock !== "undefined") {
      this.rootLogger.warn({ requestId: context.id }, "Using preconfigured mock oauth tocken..");
      return oAuthMock;
    } else if (typeof context.body.originalRequest.data !== "undefined" && typeof context.body.originalRequest.data.user !== "undefined")
      return context.body.originalRequest.data.user.accessToken;
    else return null;
  }

  protected getTemporalToken(context: RequestContext): string | null {
    if (typeof context.body.originalRequest.data !== "undefined" && typeof context.body.originalRequest.data.user !== "undefined")
      return context.body.originalRequest.data.user.userId;
    else return null;
  }

  /**
   * Get inital spokentext from context or delegate to apiai implementation
   * @param context 
   */
  protected getSpokenText(context: RequestContext): string {

    if(context.body.originalRequest
      && context.body.originalRequest.data 
      && context.body.originalRequest.data.inputs 
      && context.body.originalRequest.data.inputs[0] 
      && context.body.originalRequest.data.inputs[0].rawInputs
      && context.body.originalRequest.data.inputs[0].rawInputs[0]){
      return context.body.originalRequest.data.inputs[0].rawInputs[0].query;
    }


    return super.getSpokenText(context);
  }

  /**
   * Get session data from userStorage
   * @param context 
   */
  private getSessionData(context: RequestContext): string | null {
    if (typeof context.body.originalRequest.data !== "undefined" 
        && typeof context.body.originalRequest.data.user !== "undefined"
        && typeof context.body.originalRequest.data.user.userStorage !== "undefined") 
      return context.body.originalRequest.data.user.userStorage
    else return null;
  }
}
