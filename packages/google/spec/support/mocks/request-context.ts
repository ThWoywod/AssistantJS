import { RequestContext } from "assistant-source";

export const validRequestContext: RequestContext = {
  // tslint:disable-next-line:no-empty
  responseCallback: () => {},
  id: "my-request-id",
  path: "/apiai",
  method: "POST",
  headers: {},
  body: {
    responseId: "my-dialogflow-response-id",
    session: "my-dialogflow-session",
    queryResult: {
      queryText: "user's original agent query",
      languageCode: "en",
      parameters: {},
      allRequiredParamsPresent: true,
      fulfillmentMessages: [
        {
          text: {
            text: [""],
          },
        },
      ],
      intent: {
        name: "my-unique-dialogflow-intent-name",
        displayName: "testIntent",
      },
      intentDetectionConfidence: 1,
    },
    originalDetectIntentRequest: {
      source: "google",
      version: "2",
      payload: {
        isInSandbox: true,
        surface: {
          capabilities: [
            {
              name: "actions.capability.SCREEN_OUTPUT",
            },
          ],
        },
        inputs: [
          {
            rawInputs: [
              {
                query: "Talk to my test app",
                inputType: "VOICE",
              },
            ],
            intent: "actions.intent.MAIN",
          },
        ],
        user: {
          lastSeen: "2018-03-16T22:08:48Z",
          permissions: ["UPDATE"],
          locale: "en-US",
          idToken: "my-google-user-id",
          userStorage: '{"my-session-key":"my-session-value"}',
          accessToken: "my-access-token",
        },
        accessToken: "my-access-token",
      },
      conversation: {
        conversationId: "1509984249465",
        type: "NEW",
      },
      availableSurfaces: [
        {
          capabilities: [
            {
              name: "actions.capability.SCREEN_OUTPUT",
            },
            {
              name: "actions.capability.AUDIO_OUTPUT",
            },
          ],
        },
      ],
    },
  },
};
