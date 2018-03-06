import { RequestExtractor, RequestContext, injectionNames, Logger } from "assistant-source";
import { Extractor as ApiAiExtractor } from "assistant-apiai"
import { injectable, inject, optional } from "inversify";
import { Component } from "inversify-components";

import { Extraction } from "./public-interfaces";

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

    return typeof context.body.originalRequest !== "undefined" && context.body.originalRequest.data !== "undefined" && context.body.originalRequest.data.device !== "undefined"
  }

  async extract(context: RequestContext): Promise<Extraction> {
    this.rootLogger.info("Extracting request on google platform...", { requestId: context.id });
    let apiAiExtraction = await super.extract(context);

    return Object.assign(apiAiExtraction, {
      platform: this.googleComponent.name,
      oAuthToken: this.getOAuthToken(context),
      temporalAuthToken: this.getTemporalToken(context)
    });
  }

  protected getOAuthToken(context: RequestContext): string | null {
    const oAuthMock = process.env.FORCED_GOOGLE_OAUTH_TOKEN;
    
    if (typeof oAuthMock !== "undefined") {
      this.rootLogger.warn("Using preconfigured mock oauth tocken..", { requestId: context.id });
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
