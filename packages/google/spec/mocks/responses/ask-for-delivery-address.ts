/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const askForDeliveryAddress = {
  payload: {
    google: {
      expectUserResponse: true,
      systemIntent: {
        intent: "actions.intent.DELIVERY_ADDRESS",
        data: {},
      },
    },
  },
};
