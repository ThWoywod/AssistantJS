/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const simpleResponseTts = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Howdy! I can tell you fun facts about almost any number, like 42. What do you have in mind?",
              displayText: "Howdy! I can tell you fun facts about almost any number. What do you have in mind?",
            },
          },
        ],
      },
    },
  },
};
