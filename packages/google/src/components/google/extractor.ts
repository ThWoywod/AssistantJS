import { unifierInterfaces, rootInterfaces } from "assistant-source";
import { Extractor as ApiAiExtractor } from "assistant-apiai"
import { injectable, inject, optional } from "inversify";
import { Component } from "inversify-components";

import { Extraction } from "./interfaces";
import { log } from "../../global";

@injectable()
export class Extractor extends ApiAiExtractor implements unifierInterfaces.RequestConversationExtractor {
  googleComponent: Component;

  constructor(
    @inject("meta:component//google") googleComponent: Component,
    @optional() @inject("meta:component//apiai") componentMeta?: Component
  ) {
    if (typeof componentMeta === "undefined") throw new Error("Could not find api.ai component. You cannot use the google assistant platform without 'assistant-apiai'!");
    super(componentMeta);

    this.googleComponent = googleComponent;
  }

  async fits(context: rootInterfaces.RequestContext) {
    let apiAiFits = await super.fits(context);
    if (!apiAiFits) return false;

    return typeof context.body.originalRequest !== "undefined" && context.body.originalRequest.data !== "undefined" && context.body.originalRequest.data.device !== "undefined"
  }

  async extract(context: rootInterfaces.RequestContext): Promise<Extraction> {
    log("Extracting request on google platform...");
    let apiAiExtraction = await super.extract(context);

    return Object.assign(apiAiExtraction, {
      component: this.googleComponent,
      oAuthToken: this.getOAuthToken(context)
    });
  }

  protected getOAuthToken(context: rootInterfaces.RequestContext): string | null {
    if (typeof context.body.originalRequest.data !== "undefined" && typeof context.body.originalRequest.data.user !== "undefined")
      return context.body.originalRequest.data.user.access_token;
    else
      return null;
  }
}
