import { RequestExtractor, RequestContext, injectionNames, Logger } from "assistant-source";
import { Extractor as ApiAiExtractor } from "assistant-apiai"
import { injectable, inject, optional } from "inversify";
import { Component } from "inversify-components";

import { Extraction, Device } from "./public-interfaces";

@injectable()
export class Extractor extends ApiAiExtractor implements RequestExtractor {
  googleComponent: Component;
  private rootLogger: Logger;

  constructor(
    @inject("meta:component//google") googleComponent: Component,
    @inject(injectionNames.logger) logger: Logger,
    @optional() @inject("meta:component//apiai") componentMeta?: Component<any>
  ) {
    if (typeof componentMeta === "undefined") throw new Error("Could not find api.ai component. You cannot use the google assistant platform without 'assistant-apiai'!");
    super(componentMeta, logger);

    this.rootLogger = logger;
    this.googleComponent = googleComponent;
  }

  async fits(context: RequestContext) {
    let apiAiFits = await super.fits(context);
    if (!apiAiFits) return false;

    this.rootLogger.debug("Google: Requests fits for dialogflow, now checking if all needed google data is contained.", { requestId: context.id });

    return  typeof context.body.originalRequest !== "undefined" && 
      typeof context.body.originalRequest.data !== "undefined" && 
      typeof context.body.originalRequest.data.device !== "undefined" &&
      typeof context.body.originalRequest.data.surface !== "undefined" &&
      typeof context.body.originalRequest.data.surface.capabilities !== "undefined";
  }

  async extract(context: RequestContext): Promise<Extraction> {
    this.rootLogger.info("Google: Extracting request on google platform...", { requestId: context.id });
    let apiAiExtraction = await super.extract(context);

    return Object.assign(apiAiExtraction, {
      platform: this.googleComponent.name,
      oAuthToken: this.getOAuthToken(context),
      temporalAuthToken: this.getTemporalToken(context),
      device: this.getDevice(context)
    });
  }

  protected getDevice(context: RequestContext): Device {
    const capabilities = context.body.originalRequest.data.surface.capabilities;
    return capabilities.map(c => c.name).indexOf("actions.capability.SCREEN_OUTPUT") === -1 ? "speaker" : "phone";
  }

  protected getOAuthToken(context: RequestContext): string | null {
    const oAuthMock = process.env.FORCED_GOOGLE_OAUTH_TOKEN;
    
    if (typeof oAuthMock !== "undefined") {
      this.rootLogger.warn("Google: Using preconfigured mock oauth tocken..", { requestId: context.id });
      return oAuthMock;
    }
    else if (typeof context.body.originalRequest.data !== "undefined" && typeof context.body.originalRequest.data.user !== "undefined")
      return context.body.originalRequest.data.user.accessToken;
    else
      return null;
  }

  protected getTemporalToken(context: RequestContext): string | null {
    if (typeof context.body.originalRequest.data !== "undefined" && typeof context.body.originalRequest.data.user !== "undefined")
      return context.body.originalRequest.data.user.userId;
    else
      return null;
  }
}
