/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const askForPermission = {
  payload: {
    google: {
      expectUserResponse: true,
      systemIntent: {
        intent: "actions.intent.PERMISSION",
        data: {
          "@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
          optContext: "To deliver your order",
          permissions: ["NAME", "DEVICE_PRECISE_LOCATION"],
        },
      },
    },
  },
};
