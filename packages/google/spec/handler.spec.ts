import { DialogflowInterface } from "assistant-apiai";
import { SpecHelper } from "assistant-source";
import { GoogleSpecificHandable, GoogleSpecificTypes } from "../src/assistant-google";
import { DialogflowResponse } from "../src/components/google/conversation-interface/dialogflow-response";
import { GoogleSpecHelper } from "../src/spec-helper";
import { askForSignIn } from "./mocks/responses/AskForSignIn";
import { endConversation } from "./mocks/responses/EndConversation";
import { noInput } from "./mocks/responses/NoInput";
import { simpleResponse } from "./mocks/responses/RichResponses/SimpleResponse";
import { simpleResponseMultipleChatBubbles } from "./mocks/responses/RichResponses/SimpleResponseMultipleChatBubbles";
import { simpleResponseTts } from "./mocks/responses/RichResponses/SimpleResponseTts";

interface CurrentThisContext {
  specHelper: SpecHelper;
  googleSpecHelper: GoogleSpecHelper;
  handler: GoogleSpecificHandable<GoogleSpecificTypes>;
  responseResults: Partial<GoogleSpecificTypes>;
  actualResponse: DialogflowInterface.WebhookResponse<DialogflowResponse>;
}

describe("Handler", function() {
  beforeEach(async function(this: CurrentThisContext) {
    this.googleSpecHelper = new GoogleSpecHelper(this.specHelper);
    this.handler = await this.googleSpecHelper.pretendIntentCalled("test");
    this.responseResults = this.specHelper.getResponseResults();
  });

  it("is correctly linked to spec setup", function(this: CurrentThisContext) {
    expect(this.responseResults.shouldSessionEnd).toBeTruthy();
    expect(this.responseResults.voiceMessage).toBeTruthy();
    expect(this.responseResults.voiceMessage!.text).toBe("Hello from google!");
  });

  it("cannot be executed twice", async function(this: CurrentThisContext) {
    try {
      await this.handler.send();
      fail("should throw error");
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  describe("Authentication", function() {
    describe("when authentication is not necessary", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          voiceMessage: {
            isSSML: false,
            text: "this is a simple response",
          },
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("returns normal answer", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(simpleResponse as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });

    describe("when authentication is necessary", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          shouldAuthenticate: true,
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("returns, that SignIn is needed", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(askForSignIn as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });
  });

  describe("when session should end", function() {
    describe("without suggestionChips", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          shouldSessionEnd: true,
          voiceMessage: {
            isSSML: false,
            text: "Goodbye!",
          },
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("send finalResponse", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(endConversation as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });

    describe("with suggestionChips", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          shouldSessionEnd: true,
          voiceMessage: {
            isSSML: false,
            text: "Goodbye!",
          },
          suggestionChips: ["Try again", "Really exit"],
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("ignores suggestion chips", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(endConversation as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });
  });

  describe("with voiceMessage", function() {
    describe("with reprompts", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          voiceMessage: {
            isSSML: false,
            text: "What's your name?",
          },
          reprompts: [
            { isSSML: false, text: "I didn't hear you. Can you say your name?" },
            { isSSML: true, text: "<speak>I didn't get that.  What is your name?</speak>" },
            { isSSML: false, text: "I seem to be having trouble. Please try again later." },
          ],
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("returns both", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(noInput as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });

    describe("with chat bubbles", function() {
      describe("with one chat bubble", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.responseResults = {
            voiceMessage: {
              isSSML: false,
              text: "Howdy! I can tell you fun facts about almost any number, like 42. What do you have in mind?",
            },
            chatBubbles: ["Howdy! I can tell you fun facts about almost any number. What do you have in mind?"],
          };

          this.actualResponse = (this.handler as any).getBody(this.responseResults);
        });

        it("returns voiceMessage with displaytext", async function(this: CurrentThisContext) {
          expect(this.actualResponse).toEqual(simpleResponseTts as DialogflowInterface.WebhookResponse<DialogflowResponse>);
        });
      });

      describe("with multiple chat bubbles", function() {
        describe("with two chat bubbles", function() {
          beforeEach(async function(this: CurrentThisContext) {
            this.responseResults = {
              voiceMessage: {
                isSSML: false,
                text: "Howdy! I can tell you fun facts about almost any number, like 42. What do you have in mind?",
              },
              chatBubbles: [
                "Howdy! I can tell you fun facts about almost any number. What do you have in mind?",
                "I can also tell you some facts about almost any primenumber. Which primenumber do you choose?",
              ],
            };

            this.actualResponse = (this.handler as any).getBody(this.responseResults);
          });

          it("returns voicemessage with chat bubble and additional chat bubbles", async function(this: CurrentThisContext) {
            expect(this.actualResponse).toEqual(simpleResponseMultipleChatBubbles as DialogflowInterface.WebhookResponse<DialogflowResponse>);
          });
        });

        describe("with more then two chat bubbles", function() {
          beforeEach(async function(this: CurrentThisContext) {
            this.responseResults = {
              voiceMessage: {
                isSSML: false,
                text: "Howdy! I can tell you fun facts about almost any number, like 42. What do you have in mind?",
              },
              chatBubbles: [
                "Howdy! I can tell you fun facts about almost any number. What do you have in mind?",
                "I can also tell you some facts about almost any primenumber.",
                "Which primenumber do you choose?",
              ],
            };

            this.actualResponse = (this.handler as any).getBody(this.responseResults);
          });

          it("returns voicemessage with only two chat bubbles", async function(this: CurrentThisContext) {
            expect(this.actualResponse).toEqual(simpleResponseMultipleChatBubbles as DialogflowInterface.WebhookResponse<DialogflowResponse>);
          });
        });
      });
    });

    describe("without additional infos", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.responseResults = {
          voiceMessage: {
            isSSML: false,
            text: "this is a simple response",
          },
        };

        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });
      it("returns only voiceMessage", async function(this: CurrentThisContext) {
        expect(this.actualResponse).toEqual(simpleResponse as DialogflowInterface.WebhookResponse<DialogflowResponse>);
      });
    });
  });
});
