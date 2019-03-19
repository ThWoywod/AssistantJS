/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const basicCard = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "This is a Basic Card",
            },
          },
          {
            basicCard: {
              title: "Card Title",
              subtitle: "Card Subtitle",
              formattedText: "Card description",
              image: {
                url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                accessibilityText: "Google Logo",
              },
              buttons: [
                {
                  title: "Button Title",
                  openUrlAction: {
                    url: "https://www.google.com",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
};
