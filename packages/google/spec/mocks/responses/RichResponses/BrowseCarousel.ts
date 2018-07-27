/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56 and https://developers.google.com/actions/assistant/responses#browsing_carousel
 */
export const browseCarousel = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Alright! Here are a few web pages you might want to check out.",
            },
          },
          {
            carouselBrowse: {
              items: [
                {
                  title: "GitHub",
                  description:
                    "GitHub is a development platform inspired by the way you work. From open source to business, you can host and review code, manage projects, and build software alongside millions of other developers. ",
                  footer: "A better way to work together ",
                  image: {
                    url: "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
                    accessibilityText: "GitHubs OctoCat",
                  },
                  openUrlAction: {
                    url: "https://github.com",
                  },
                },
                {
                  title: "Wikipedia",
                  description: "Wikipedia is a free encyclopedia.",
                  footer: "Source of free knowledge",
                  image: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png",
                    accessibilityText: "Wikipedia Logo",
                  },
                  openUrlAction: {
                    url: "https://en.wikipedia.org/wiki/Main_Page",
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
