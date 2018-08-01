/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const noInput = {
  payload: {
    google: {
      expectUserResponse: true,
      noInputPrompts: [
        {
          textToSpeech: "I didn't hear you. Can you say your name?",
        },
        {
          ssml: "<speak>I didn't get that.  What is your name?</speak>",
        },
        {
          textToSpeech: "I seem to be having trouble. Please try again later.",
        },
      ],
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "What's your name?",
            },
          },
        ],
      },
    },
  },
};
