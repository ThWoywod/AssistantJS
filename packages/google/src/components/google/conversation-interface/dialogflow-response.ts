import { ExpectedIntent, RichResponse, SimpleResponse } from "./app-response";

/**
 * The response message that AssistantJS sends to Dialogflow in
 * the specific webhook format
 * @example
 * {
 *  "expectUserResponse": boolean,
 *  "userStorage": string,
 *  "richResponse": object,
 *  "systemIntent": object
 * }
 */
export interface DialogflowResponse {
  google: {
    noInputPrompts: SimpleResponse[];

    /** Indicates whether the app is expecting a user response. This is true when the conversation is ongoing, false when the conversation is done. */
    expectUserResponse: boolean;
    /**
     * An opaque token controlled by the application that is persisted across conversations for a particular user.
     * If empty or unspecified, the existing persisted token will be unchanged
     */
    userStorage: string;
    /** This field contains audio, text, cards, suggestions, or structured data for the Assistant to render. */
    richResponse: RichResponse;
    /**
     * Your response typically contains a systemIntent if your fulfillment is using a helper intent.
     * The possibleIntents field in the systemIntent must be set to an ExpectedIntent object, with the inputValueData field name changed to data.
     */
    systemIntent: DialogflowSystemIntent;
  };
}

export interface DialogflowSystemIntent {
  /**
   * The built-in intent name, e.g. actions.intent.TEXT, or intents defined in the action package.
   * If the intent specified is not a built-in intent, it is only used for speech biasing and the input provided by the Google Assistant will be the actions.intent.TEXT intent.
   */
  intent?: string;
  /**
   * Your response typically contains a systemIntent if your fulfillment is using a helper intent.
   * The possible value specification strings for helpers that you can set in a systemIntent can be found at
   * https://developers.google.com/actions/build/json/dialogflow-webhook-json#dialogflow-response-body
   */
  data?: {
    [key: string]: any;
  };
}
