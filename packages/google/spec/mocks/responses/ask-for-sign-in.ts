/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const askForSignIn = {
  payload: {
    google: {
      expectUserResponse: true,
      systemIntent: {
        intent: "actions.intent.SIGN_IN",
        data: {},
      },
    },
  },
};
