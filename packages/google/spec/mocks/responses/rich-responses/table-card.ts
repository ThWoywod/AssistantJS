export const tableCard = {
  payload: {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "What meal do like most?",
            },
          },
          {
            tableCard: {
              title: "Your favorite Food",
              rows: [
                { cells: [{ text: "Hamburger" }, { text: "yesterday" }] },
                { cells: [{ text: "Ice-Cream" }, { text: "today" }] },
                { cells: [{ text: "Pizza" }, { text: "three days ago" }] },
              ],
              subtitle: "Compare diffrent dishes",
              columnProperties: [
                {
                  header: "Food",
                },
                {
                  header: "time ago",
                },
              ],
            },
          },
        ],
      },
    },
  },
};
