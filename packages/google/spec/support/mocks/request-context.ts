import { RequestContext } from "assistant-source";

export const validRequestContext: RequestContext = {
  responseCallback: () => {},
  id: "my-request-id",
  path: "/apiai",
  method: "POST",
  headers: {},
  body: {
    originalRequest: {
      data: {
        surface: { capabilities: [{ name: "actions.capability.AUDIO_OUTPUT" }, { name: "actions.capability.SCREEN_OUTPUT" }] },
        inputs: [{ rawInputs: [{ inputType: "VOICE", query: "My query" }], intent: "actions.intent.MAIN" }],
        user: { locale: "de-DE", userId: "my-user-id", accessToken: "my-access-token", userStorage: "{\"my-session-key\":\"my-session-value\"}"},
        conversation: { conversationId: "1509984249465", type: "NEW" },
        availableSurfaces: [{ capabilities: [{ name: "actions.capability.AUDIO_OUTPUT" }, { name: "actions.capability.SCREEN_OUTPUT" }] }],
      },
    },
    sessionId: "my-session-id",
    timestamp: "2017-06-24T16:00:18Z",
    result: { resolvedQuery: "My query", metadata: { intentName: "testIntent" } },
    lang: "en",
  },
};
