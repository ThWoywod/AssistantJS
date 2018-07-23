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
import { ExpectedInput, InputPrompt, Item, ResponseBodyPayload, RichResponse, SimpleResponse } from "./conversation-interface";
import { GoogleSpecificHandable, GoogleSpecificTypes } from "./public-interfaces";

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

  public getBody(results: Partial<CustomTypes>): DialogflowInterface.ResponseBody<ResponseBodyPayload> {
    // Validation: Check if there is a voice message if sign in is forced
    if (results.shouldAuthenticate) {
      if (!results.voiceMessage || !results.voiceMessage.text) {
        throw new Error("Since there is no auto handling, you have to pass a voice message in order to use 'forceAuthenticated' on google assistant");
      }
    }

    // Grab response for api.ai
    const response: DialogflowInterface.ResponseBody<Partial<ResponseBodyPayload>> = super.getBody(results);

    let payload = response.payload || {};

    [this.fillPrompt, this.fillAuthentication, this.fillCard, this.fillChatBubbles, this.fillReprompts, this.fillSessionData, this.fillSuggestionChips].forEach(
      (fn: (results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>) => Partial<ResponseBodyPayload>) => {
        payload = fn(results, payload);
      }
    );

    response.payload = payload;

    return response;
  }

  private createExpectedInput(): ExpectedInput {
    const expectedInput: ExpectedInput = {
      inputPrompt: {
        richInitialPrompt: this.createRichResponse(),
      },
    };

    return expectedInput;
  }

  private createExpectedInputs(payload: Partial<ResponseBodyPayload>): payload is Partial<ResponseBodyPayload> & { expectedInputs: ExpectedInput[] } {
    if (!payload.expectedInputs) {
      payload.expectedInputs = [];
    }
    return true;
  }

  private fillPrompt(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    let currentPayload = payload;

    if (results.voiceMessage) {
      if (results.voiceMessage) {
        if (!results.shouldSessionEnd) {
          const expectedInput = this.createExpectedInput();

          expectedInput.inputPrompt!.richInitialPrompt!.items!.push({ simpleResponse: this.createSimpleResponse(results.voiceMessage) });

          if (this.createExpectedInputs(currentPayload)) {
            currentPayload.expectedInputs.push(expectedInput);
          }
        } else {
          currentPayload = this.fillEndSession(results.voiceMessage, currentPayload);
        }
      }
    }

    return currentPayload;
  }

  private fillEndSession(voiceMessage: CustomTypes["voiceMessage"], payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    payload.finalResponse = this.createRichResponse();
    payload.finalResponse.items!.push({ simpleResponse: this.createSimpleResponse(voiceMessage) });

    return payload;
  }

  private fillAuthentication(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    if (results.shouldSessionEnd) {
      if (this.createExpectedInputs(payload)) {
        payload.expectedInputs.push({
          possibleIntents: {
            intent: "actions.intent.SIGN_IN",
            inputValueData: {},
          },
        });
      }
    }

    return payload;
  }

  private fillCard(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    if (results.card) {
      if (this.createExpectedInputs(payload)) {
        if (payload.expectedInputs.length <= 0) {
          payload.expectedInputs.push(this.createExpectedInput());
        }

        payload.expectedInputs[0].inputPrompt!.richInitialPrompt!.items!.push({
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
    }

    return payload;
  }

  private fillChatBubbles(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    if (results.chatBubbles) {
      if (this.createExpectedInputs(payload)) {
        payload.expectedInputs.forEach((expectedInput: ExpectedInput) => {
          if (expectedInput.inputPrompt && expectedInput.inputPrompt.richInitialPrompt && expectedInput.inputPrompt.richInitialPrompt.items) {
            expectedInput.inputPrompt.richInitialPrompt.items.forEach((item: Item) => {
              if (this.isSimpleResponse(item)) {
                item.simpleResponse.displayText = results.chatBubbles![0];
              }
            });
          }
        });
      }
    }

    return payload;
  }

  private fillReprompts(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    if (results.reprompts) {
      if (this.createExpectedInputs(payload)) {
        payload.expectedInputs.forEach((expectedInput: ExpectedInput) => {
          if (expectedInput.inputPrompt && expectedInput.inputPrompt.richInitialPrompt) {
            expectedInput.inputPrompt.noInputPrompts = results.reprompts!.map(value => this.createSimpleResponse(value));
          }
        });
      }
    }

    return payload;
  }

  private fillSessionData(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    // Add session data
    if (!results.sessionData) {
      payload.userStorage = results.sessionData;
    }
    return payload;
  }

  private fillSuggestionChips(results: Partial<CustomTypes>, payload: Partial<ResponseBodyPayload>): Partial<ResponseBodyPayload> {
    throw new Error();
  }

  private createRichResponse(): RichResponse {
    return {
      items: [],
      suggestions: [],
    };
  }

  private createSimpleResponse(voiceMessage: CustomTypes["voiceMessage"]): SimpleResponse {
    return voiceMessage.isSSML
      ? {
          ssml: voiceMessage.text,
        }
      : {
          textToSpeech: voiceMessage.text,
        };
  }

  private isSimpleResponse(item: Item): item is { simpleResponse: SimpleResponse } {
    return typeof item.simpleResponse !== "undefined";
  }
}
