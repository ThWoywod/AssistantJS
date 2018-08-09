/**
 * Source: https://github.com/dialogflow/fulfillment-webhook-json/tree/4c7fa3dce6bd2d3ae6ae98bc4c3f479ed4fb9f56
 */
export const askForDatetime = {
  payload: {
    google: {
      expectUserResponse: true,
      systemIntent: {
        intent: "actions.intent.DATETIME",
        data: {
          "@type": "type.googleapis.com/google.actions.v2.DateTimeValueSpec",
          dialogSpec: {
            requestDatetimeText: "When do you want to come in?",
            requestDateText: "What is the best date to schedule your appointment?",
            requestTimeText: "What time of day works best for you?",
          },
        },
      },
    },
  },
};
