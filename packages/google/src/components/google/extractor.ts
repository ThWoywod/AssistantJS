import { Extractor as ApiAiExtractor } from "assistant-apiai";
import {
  AccountLinkingStatus,
  CommonRequestExtraction,
  ComponentSpecificLoggerFactory,
  GenericIntent,
  injectionNames,
  intent as Intent,
  Logger,
  RequestContext,
  RequestExtractor,
} from "assistant-source";
import { inject, injectable, optional } from "inversify";
import { Component, getMetaInjectionName } from "inversify-components";

import { AppRequest, Input, RawInput } from "./conversation-interface";
import { googleInjectionNames } from "./injection-names";
import {
  COMPONENT_NAME,
  GoogleRequestContextWithCapabilites,
  GoogleRequestContextWithInputArguments,
  GoogleRequestContextWithInputs,
  GoogleRequestContextWithUser,
} from "./private-interfaces";
import { Device, Extraction, GoogleRequestContext } from "./public-interfaces";

@injectable()
export class Extractor extends ApiAiExtractor implements RequestExtractor {
  public googleComponent: Component;
  private rootLogger: Logger;

  constructor(
    @inject(getMetaInjectionName(COMPONENT_NAME)) googleComponent: Component,
    @inject(injectionNames.componentSpecificLoggerFactory) loggerFactory: ComponentSpecificLoggerFactory,
    @optional()
    @inject(getMetaInjectionName("apiai"))
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

    return this.surfaceCapabilitesAreDefined(context);
  }

  public async extract(context: GoogleRequestContext): Promise<Extraction> {
    this.rootLogger.info({ requestId: context.id }, "Extracting request on google platform...");
    const apiAiExtraction = await super.extract(context);

    const oAuthToken = this.getOAuthToken(context);

    return {
      ...apiAiExtraction,
      oAuthToken,
      intent: this.getIntent(context),
      entities: this.getEntities(context),
      platform: this.googleComponent.name,
      sessionData: this.getSessionData(context),
      device: this.getDevice(context),
      accountLinkingStatus: this.getAccountLinkingStatus(context, oAuthToken),
    };
  }

  protected getDevice(context: GoogleRequestContext) {
    if (this.surfaceCapabilitesAreDefined(context)) {
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
    if (this.userIsDefined(context) && typeof context.body.originalDetectIntentRequest.payload.user.accessToken !== "undefined") {
      return context.body.originalDetectIntentRequest.payload.user.accessToken;
    }
    return null;
  }

  protected getAccountLinkingStatus(context: GoogleRequestContext, oAuthToken: string | null): AccountLinkingStatus | null {
    if (
      this.hasArgumentsInFirstInput(context) &&
      this.equalsIntent(context, "actions.intent.SIGN_IN") &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0] &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].extension &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].extension.status === "CANCELLED"
    ) {
      return AccountLinkingStatus.CANCELLED;
    }

    if (oAuthToken) {
      return AccountLinkingStatus.OK;
    }

    return null;
  }

  /**
   * Get inital spokentext from context or delegate to apiai implementation
   * @param context
   */
  protected getSpokenText(context: GoogleRequestContext): string {
    if (this.hasPayloadWithInputs(context) && context.body.originalDetectIntentRequest.payload.inputs[0].rawInputs) {
      return context.body.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query!;
    }
    return super.getSpokenText(context);
  }

  /**
   * Get Google specific intents which can not be extracted by dialogflow
   * @param context
   */
  protected getIntent(context: GoogleRequestContext): Intent {
    const intent = super.getIntent(context);

    // All intent unequal to Unhandled can be passed through
    if (intent !== GenericIntent.Unhandled) {
      return intent;
    }

    // Extract SelectedElementIntent when Google sends unhandledIntent
    if (this.equalsIntent(context, "actions.intent.OPTION")) {
      return GenericIntent.Selected;
    }

    // return unhandled intent from apiai
    return intent;
  }

  protected getEntities(context: GoogleRequestContext) {
    const intent = this.getIntent(context);
    const entities: CommonRequestExtraction["entities"] = super.getEntities(context);

    // extract selectedElement
    if (
      intent === GenericIntent.Selected &&
      this.hasPayloadWithInputs(context) &&
      this.hasArgumentsInFirstInput(context) &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].textValue &&
      context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].name === "OPTION"
    ) {
      entities.selectedElement = context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0].textValue;
    }

    return entities;
  }

  /**
   * Get session data from userStorage
   * @param context
   */
  protected getSessionData(context: GoogleRequestContext): string | null {
    if (this.userIsDefined(context) && typeof context.body.originalDetectIntentRequest.payload.user.userStorage !== "undefined") {
      return context.body.originalDetectIntentRequest.payload.user.userStorage;
    }
    return null;
  }

  /** Checks if payload attribute exists and has inputs */
  private hasPayloadWithInputs(context: GoogleRequestContext): context is GoogleRequestContextWithInputs {
    return Boolean(
      context.body.originalDetectIntentRequest.payload &&
        context.body.originalDetectIntentRequest.payload.inputs &&
        context.body.originalDetectIntentRequest.payload.inputs.length > 0 &&
        context.body.originalDetectIntentRequest.payload.inputs[0]
    );
  }

  /** Checks if we gt some additional arguments with the first input */
  private hasArgumentsInFirstInput(context: GoogleRequestContext): context is GoogleRequestContextWithInputArguments {
    return Boolean(
      this.hasPayloadWithInputs(context) &&
        context.body.originalDetectIntentRequest.payload.inputs[0].arguments &&
        context.body.originalDetectIntentRequest.payload.inputs[0].arguments.length > 0 &&
        context.body.originalDetectIntentRequest.payload.inputs[0].arguments[0]
    );
  }

  /** Checks if given intent is in context */
  private equalsIntent(context: GoogleRequestContext, intent: string) {
    return this.hasPayloadWithInputs(context) && context.body.originalDetectIntentRequest.payload.inputs[0].intent === intent;
  }

  /** Checks if surface capabilites are defined */
  private surfaceCapabilitesAreDefined(context: GoogleRequestContext): context is GoogleRequestContextWithCapabilites {
    return (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface !== "undefined" &&
      typeof context.body.originalDetectIntentRequest.payload.surface.capabilities !== "undefined"
    );
  }

  /** Checks if user is defined in context */
  private userIsDefined(context: GoogleRequestContext): context is GoogleRequestContextWithUser {
    return (
      typeof context.body.originalDetectIntentRequest.payload !== "undefined" && typeof context.body.originalDetectIntentRequest.payload.user !== "undefined"
    );
  }
}
