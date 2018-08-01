/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const suggestions = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Howdy! I can tell you fun facts about almost any number.",
            },
          },
          {
            simpleResponse: {
              textToSpeech: "What number do you have in mind?",
            },
          },
        ],
        suggestions: [
          {
            title: "25",
          },
          {
            title: "45",
          },
          {
            title: "Never mind",
          },
        ],
        linkOutSuggestion: {
          destinationName: "Website",
          url: "https://assistant.google.com",
        },
      },
    },
  },
};
