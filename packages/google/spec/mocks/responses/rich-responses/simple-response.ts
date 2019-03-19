/**
 * The snippet below shows an example of a simple response in the Dialogflow webhook format.
 *
 * Source: https://developers.google.com/actions/build/json/dialogflow-webhook-json#simple-response-example-df
 * and https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 *
 * Portions of this file are modifications based on work created and shared by Google
 * and used according to terms described in the Creative Commons 3.0 Attribution License.
 */
export const simpleResponse = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "this is a simple response",
            },
          },
        ],
      },
    },
  },
};
