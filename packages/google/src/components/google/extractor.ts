import { Extractor as ApiAiExtractor } from "assistant-apiai";
import { ComponentSpecificLoggerFactory, injectionNames, Logger, RequestContext, RequestExtractor } from "assistant-source";
import { inject, injectable, optional } from "inversify";
import { Component } from "inversify-components";

import { AppRequest, RawInput } from "./conversation-interface";
import { COMPONENT_NAME } from "./private-interfaces";
import { Device, Extraction, GoogleRequestContext } from "./public-interfaces";

@injectable()
export class Extractor extends ApiAiExtractor implements RequestExtractor {
  public googleComponent: Component;
  private rootLogger: Logger;

  constructor(
    @inject("meta:component//google") googleComponent: Component,
    @inject(injectionNames.componentSpecificLoggerFactory) loggerFactory: ComponentSpecificLoggerFactory,
    @optional()
    @inject("meta:component//apiai")
    componentMeta?: Component<any>
  ) {
    if (typeof componentMeta === "undefined") {
      throw new Error("Could not find api.ai component. You cannot use the google assistant platform without 'assistant-apiai'!");
    }
    super(componentMeta, loggerFactory);

    this.rootLogger = loggerFactory(COMPONENT_NAME, "root");
    this.googleComponent = googleComponent;
  }

  public async fits(context: GoogleRequestContext) {
    const apiAiFits = await super.fits(context);
    if (!apiAiFits) return false;

    this.rootLogger.debug({ requestId: context.id }, "Requests fits for dialogflow, now checking if all needed google data is contained.");

    return (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface.capabilities !== "undefined"
    );
  }

  public async extract(context: GoogleRequestContext): Promise<Extraction> {
    this.rootLogger.info({ requestId: context.id }, "Extracting request on google platform...");
    const apiAiExtraction = await super.extract(context);

    return {
      ...apiAiExtraction,
      platform: this.googleComponent.name,
      sessionData: this.getSessionData(context),
      oAuthToken: this.getOAuthToken(context),
      temporalAuthToken: this.getTemporalToken(context),
      device: this.getDevice(context),
    };
  }

  protected getDevice(context: GoogleRequestContext) {
    if (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface.capabilities !== "undefined"
    ) {
      const capabilities = context.body.originalDetectIntentRequest.payload.surface.capabilities;
      return capabilities.map(c => c.name).indexOf("actions.capability.SCREEN_OUTPUT") === -1 ? "speaker" : "phone";
    }
    return "";
  }

  protected getOAuthToken(context: GoogleRequestContext): string | null {
    const oAuthMock = process.env.FORCED_GOOGLE_OAUTH_TOKEN;

    if (typeof oAuthMock !== "undefined") {
      this.rootLogger.warn({ requestId: context.id }, "Using preconfigured mock oauth tocken..");
      return oAuthMock;
    }
    if (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user.accessToken !== "undefined"
    ) {
      return context.body.originalDetectIntentRequest.payload.user.accessToken;
    }
    return null;
  }

  protected getTemporalToken(context: GoogleRequestContext): string | null {
    if (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user.idToken !== "undefined"
    ) {
      return context.body.originalDetectIntentRequest.payload.user.idToken;
    }
    return null;
  }

  /**
   * Get inital spokentext from context or delegate to apiai implementation
   * @param context
   */
  protected getSpokenText(context: GoogleRequestContext): string {
    if (
      context.body.originalDetectIntentRequest &&
      context.body.originalDetectIntentRequest.payload &&
      context.body.originalDetectIntentRequest.payload.inputs &&
      context.body.originalDetectIntentRequest.payload.inputs[0] &&
      context.body.originalDetectIntentRequest.payload.inputs[0].rawInputs
    ) {
      return context.body.originalDetectIntentRequest.payload.inputs[0].rawInputs![0].query!;
    }
    return super.getSpokenText(context);
  }

  /**
   * Get session data from userStorage
   * @param context
   */
  private getSessionData(context: GoogleRequestContext): string | null {
    if (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.user.userStorage !== "undefined"
    ) {
      return context.body.originalDetectIntentRequest.payload.user.userStorage;
    }
    return null;
  }
}
