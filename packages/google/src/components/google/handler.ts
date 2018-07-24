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
import { GoogleInterface, GoogleSpecificHandable, GoogleSpecificTypes } from "./public-interfaces";

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

  public getBody(results: Partial<CustomTypes>): DialogflowInterface.WebhookResponse<GoogleInterface.AppResponse> {
    // Validation: Check if there is a voice message if sign in is forced
    if (results.shouldAuthenticate) {
      if (!results.voiceMessage || !results.voiceMessage.text) {
        throw new Error("Since there is no auto handling, you have to pass a voice message in order to use 'forceAuthenticated' on google assistant");
      }
    }

    // Grab response for api.ai
    const response: DialogflowInterface.WebhookResponse<Partial<GoogleInterface.AppResponse>> = super.getBody(results);

    let payload = response.payload || {};

    [this.fillPrompt, this.fillAuthentication, this.fillCard, this.fillChatBubbles, this.fillReprompts, this.fillSessionData, this.fillSuggestionChips].forEach(
      (fn: (results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>) => Partial<GoogleInterface.AppResponse>) => {
        payload = fn(results, payload);
      }
    );

    response.payload = payload;

    return response;
  }

  private createExpectedInput(): GoogleInterface.ExpectedInput {
    const expectedInput: GoogleInterface.ExpectedInput = {
      inputPrompt: {
        richInitialPrompt: this.createRichResponse(),
      },
    };

    return expectedInput;
  }

  private createExpectedInputs(
    payload: Partial<GoogleInterface.AppResponse>
  ): payload is Partial<GoogleInterface.AppResponse> & { expectedInputs: GoogleInterface.ExpectedInput[] } {
    if (!payload.expectedInputs) {
      payload.expectedInputs = [];
    }
    return true;
  }

  private fillEndSession(payload: Partial<GoogleInterface.AppResponse>, voiceMessage?: CustomTypes["voiceMessage"]): Partial<GoogleInterface.AppResponse> {
    payload.finalResponse = this.createRichResponse();
    if (voiceMessage) {
      payload.finalResponse.items!.push({ simpleResponse: this.createSimpleResponse(voiceMessage) });
    }

    return payload;
  }

  private fillAuthentication(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
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

  private fillCard(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
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

  private fillPrompt(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
    const currentPayload = payload;

    // Check wether the session should end
    if (results.shouldSessionEnd) {
      if (!results.voiceMessage) {
        return this.fillEndSession(currentPayload);
      }

      return this.fillEndSession(currentPayload, results.voiceMessage);
    }

    const expectedInput = this.createExpectedInput();

    if (results.voiceMessage) {
      // first chatbubble is for voiceMessage
      if (results.chatBubbles && results.chatBubbles.length > 0) {
        results.chatBubbles.forEach((value, index) => {
          let currentItem: GoogleInterface.Item;

          currentItem =
            index === 0
              ? { simpleResponse: this.createSimpleResponse(results.voiceMessage!, value) }
              : (currentItem = { simpleResponse: this.createSimpleResponse(value) });

          expectedInput.inputPrompt!.richInitialPrompt!.items!.push(currentItem);
        });
      } else {
        const currentItem = { simpleResponse: this.createSimpleResponse(results.voiceMessage) };
        expectedInput.inputPrompt!.richInitialPrompt!.items!.push(currentItem);
      }
    } else if (results.chatBubbles && results.chatBubbles.length > 0) {
      results.chatBubbles.forEach((value, index) => {
        let currentItem: GoogleInterface.Item;

        currentItem = currentItem = { simpleResponse: this.createSimpleResponse(value) };

        expectedInput.inputPrompt!.richInitialPrompt!.items!.push(currentItem);
      });
    }

    if (this.createExpectedInputs(currentPayload)) {
      currentPayload.expectedInputs.push(expectedInput);
    }

    return currentPayload;
  }

  private fillChatBubbles(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
    if (results.chatBubbles) {
      if (this.createExpectedInputs(payload)) {
        if (
          payload.expectedInputs[0] &&
          payload.expectedInputs[0].inputPrompt &&
          payload.expectedInputs[0].inputPrompt!.richInitialPrompt &&
          payload.expectedInputs[0].inputPrompt!.richInitialPrompt!.items
        ) {
          payload.expectedInputs[0].inputPrompt!.richInitialPrompt!.items!.forEach((item: GoogleInterface.Item) => {
            if (this.isSimpleResponse(item)) {
              item.simpleResponse.displayText = results.chatBubbles![0];
            }
          });
        }
      }
    }

    return payload;
  }

  private fillReprompts(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
    if (results.reprompts) {
      if (this.createExpectedInputs(payload)) {
        payload.expectedInputs.forEach((expectedInput: GoogleInterface.ExpectedInput) => {
          if (expectedInput.inputPrompt && expectedInput.inputPrompt.richInitialPrompt) {
            expectedInput.inputPrompt.noInputPrompts = results.reprompts!.map(value => this.createSimpleResponse(value));
          }
        });
      }
    }

    return payload;
  }

  private fillSessionData(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
    // Add session data
    if (!results.sessionData) {
      payload.userStorage = results.sessionData;
    }
    return payload;
  }

  private fillSuggestionChips(results: Partial<CustomTypes>, payload: Partial<GoogleInterface.AppResponse>): Partial<GoogleInterface.AppResponse> {
    if (results.suggestionChips) {
      if (this.createExpectedInputs(payload)) {
        if (payload.expectedInputs[0].inputPrompt && payload.expectedInputs[0].inputPrompt!.richInitialPrompt) {
          payload.expectedInputs[0].inputPrompt!.richInitialPrompt!.suggestions = results.suggestionChips.map(chip => {
            return {
              title: chip.displayText,
            };
          });
        }
      }
    }

    return payload;
  }

  private createRichResponse(): GoogleInterface.RichResponse {
    return {
      items: [],
      suggestions: [],
    };
  }

  private createSimpleResponse(voiceMessage: CustomTypes["voiceMessage"] | string, displayText?: string): GoogleInterface.SimpleResponse {
    let result: GoogleInterface.SimpleResponse;
    if (typeof voiceMessage !== "string") {
      result = voiceMessage.isSSML
        ? {
            ssml: voiceMessage.text,
          }
        : {
            textToSpeech: voiceMessage.text,
          };
    } else {
      result = {
        textToSpeech: voiceMessage,
      };
    }

    if (displayText) {
      result.displayText = displayText;
    }

    return result;
  }

  private isSimpleResponse(item: GoogleInterface.Item): item is { simpleResponse: GoogleInterface.SimpleResponse } {
    return typeof item.simpleResponse !== "undefined";
  }
}
