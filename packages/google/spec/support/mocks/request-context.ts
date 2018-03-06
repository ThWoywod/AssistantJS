import { RequestContext } from "assistant-source";

export const validRequestContext: RequestContext = {
  responseCallback: () => {},
  id: 'my-request-id',
  path: '/apiai',
  method: 'POST',
  headers: {},
  body: {
    originalRequest: {
      data: {
        surface: { capabilities: [ { name: "actions.capability.AUDIO_OUTPUT" } ] },
        inputs: [ { rawInputs: [{ inputType: "VOICE", query: "My query" }], intent: 'actions.intent.MAIN' } ],
        user: { locale: 'de-DE', userId: 'my-user-id', accessToken: 'my-access-token' },
        conversation: { conversationId: '1509984249465', type: 'NEW' },
        availableSurfaces: [ { capabilities: [{ name: "actions.capability.AUDIO_OUTPUT" }, { name: "actions.capability.SCREEN_OUTPUT" }] } ]
      }
    },
    sessionId: "my-session-id",
    result: { resolvedQuery: "My query", metadata: { intentName: "testIntent" } },
    lang: "en"
  }
}