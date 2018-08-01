export const simpleResponseMultipleChatBubbles = {
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
          {
            simpleResponse: {
              textToSpeech: "I can also tell you some facts about almost any primenumber. Which primenumber do you choose?",
              displayText: "I can also tell you some facts about almost any primenumber. Which primenumber do you choose?",
            },
          },
        ],
      },
    },
  },
};
