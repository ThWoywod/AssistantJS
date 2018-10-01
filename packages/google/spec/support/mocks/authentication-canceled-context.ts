import { RequestContext } from "assistant-source";

export const authenticationCancelledRequestContext: RequestContext = {
  // tslint:disable-next-line:no-empty
  responseCallback: () => {},
  id: "my-request-id",
  path: "/apiai",
  method: "POST",
  headers: {},
  body: {
    responseId: "719528c6-2be0-4870-8c69-c1380e34d96b",
    queryResult: {
      queryText: "actions_intent_SIGN_IN",
      action: "input.unknown",
      parameters: {},
      allRequiredParamsPresent: true,
      fulfillmentMessages: [
        {
          text: {
            text: [""],
          },
        },
      ],
      outputContexts: [
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/google_assistant_input_type_touch",
        },
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/actions_capability_screen_output",
        },
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/actions_intent_sign_in",
          parameters: {
            SIGN_IN: {
              "@type": "type.googleapis.com/google.actions.v2.SignInValue",
              status: "CANCELLED",
            },
          },
        },
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/actions_capability_audio_output",
        },
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/actions_capability_media_response_audio",
        },
        {
          name:
            "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ/contexts/actions_capability_web_browser",
        },
      ],
      intent: {
        name: "projects/mydemoproject/agent/intents/55bb8084-b97a-4e5d-bea3-2e04b8053479",
        displayName: "__unhandled",
        isFallback: true,
      },
      intentDetectionConfidence: 1,
      languageCode: "en",
    },
    originalDetectIntentRequest: {
      source: "google",
      version: "2",
      payload: {
        isInSandbox: true,
        surface: {
          capabilities: [
            {
              name: "actions.capability.MEDIA_RESPONSE_AUDIO",
            },
            {
              name: "actions.capability.AUDIO_OUTPUT",
            },
            {
              name: "actions.capability.SCREEN_OUTPUT",
            },
            {
              name: "actions.capability.WEB_BROWSER",
            },
          ],
        },
        inputs: [
          {
            rawInputs: [
              {
                query: "No",
                inputType: "TOUCH",
              },
            ],
            arguments: [
              {
                extension: {
                  "@type": "type.googleapis.com/google.actions.v2.SignInValue",
                  status: "CANCELLED",
                },
                name: "SIGN_IN",
              },
            ],
            intent: "actions.intent.SIGN_IN",
          },
        ],
        user: {
          lastSeen: "2018-10-01T11:00:00Z",
          locale: "en-US",
          userId: "ACwxxHGrVZ_1LGIUcjhOWYX6vPxIprqt81L6D62tb8izBcxigKEtBjZt2by4yPfG3qmWQ_fnKk4703hRZwJjiAdAcQ",
        },
        conversation: {
          conversationId: "ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ",
          type: "ACTIVE",
          conversationToken: "[]",
        },
        availableSurfaces: [
          {
            capabilities: [
              {
                name: "actions.capability.AUDIO_OUTPUT",
              },
              {
                name: "actions.capability.SCREEN_OUTPUT",
              },
              {
                name: "actions.capability.WEB_BROWSER",
              },
            ],
          },
        ],
      },
    },
    session: "projects/mydemoproject/agent/sessions/ACwxxHEgvuwuk4KbZ2thABGU1MxAV31eff3Mh8SfR3W6GicxMjqTzUmUE8N_WvaGSGR18k92jzQyB4hRg7Z7Ju1IRQ",
  },
};
