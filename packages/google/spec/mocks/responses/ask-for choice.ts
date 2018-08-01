/**
 * The snippet below shows an example of using a helper intent in the Dialogflow webhook format. In this example,
 * your webhook is using the actions.intent.OPTIONS helper intent to instruct the Assistant to obtain a user selection between two options.
 *
 * Source: https://developers.google.com/actions/build/json/dialogflow-webhook-json#dialogflow-helper-example
 *
 * Portions of this file are modifications based on work created and shared by Google
 * and used according to terms described in the Creative Commons 3.0 Attribution License.
 */
export const askForChoice = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Choose a item",
            },
          },
        ],
      },
      systemIntent: {
        intent: "actions.intent.OPTION",
        data: {
          "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
          listSelect: {
            title: "Hello",
            items: [
              {
                optionInfo: {
                  key: "first title key",
                },
                description: "first description",
                image: {
                  url: "/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                  accessibilityText: "first alt",
                },
                title: "first title",
              },
              {
                optionInfo: {
                  key: "second",
                },
                description: "second description",
                image: {
                  url: "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                  accessibilityText: "second alt",
                },
                title: "second title",
              },
            ],
          },
        },
      },
    },
  },
};
