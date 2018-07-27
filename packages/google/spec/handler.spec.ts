import { DialogflowInterface } from "assistant-apiai";
import { SpecHelper } from "assistant-source";
import { GoogleInterface, GoogleSpecificHandable, GoogleSpecificTypes } from "../src/assistant-google";
import { DialogflowResponse } from "../src/components/google/conversation-interface/dialogflow-response";
import { GoogleSpecHelper } from "../src/spec-helper";
import { askForSignIn } from "./mocks/responses/AskForSignIn";
import { endConversation } from "./mocks/responses/EndConversation";
import { noInput } from "./mocks/responses/NoInput";
import { browseCarousel } from "./mocks/responses/RichResponses/BrowseCarousel";
import { carouselResponse } from "./mocks/responses/RichResponses/CarouselResponse";
import { listResponse } from "./mocks/responses/RichResponses/ListResponse";
import { simpleResponse } from "./mocks/responses/RichResponses/SimpleResponse";
import { simpleResponseMultipleChatBubbles } from "./mocks/responses/RichResponses/SimpleResponseMultipleChatBubbles";
import { simpleResponseTts } from "./mocks/responses/RichResponses/SimpleResponseTts";
import { tableCard } from "./mocks/responses/RichResponses/TableCard";

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

  describe("GoogleTable", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.responseResults = {
        voiceMessage: { isSSML: false, text: "What meal do like most?" },
        googleTable: {
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
      };

      this.actualResponse = (this.handler as any).getBody(this.responseResults);
    });

    it("returns Body with table", async function(this: CurrentThisContext) {
      expect(this.actualResponse).toEqual(tableCard as DialogflowInterface.WebhookResponse<DialogflowResponse>);
    });
  });

  describe("GoogleBrowsingCarousel", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.responseResults = {
        voiceMessage: { isSSML: false, text: "Alright! Here are a few web pages you might want to check out." },
        googleBrowsingCarousel: {
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
      };

      this.actualResponse = (this.handler as any).getBody(this.responseResults);
    });

    it("returns body with BrowsingCarousel", async function(this: CurrentThisContext) {
      expect(this.actualResponse).toEqual(browseCarousel as DialogflowInterface.WebhookResponse<DialogflowResponse>);
    });
  });

  describe("GoogleCarousel", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.responseResults = {
        voiceMessage: { isSSML: false, text: "Choose a item" },
        googleCarousel: {
          items: [
            {
              optionInfo: {
                key: "first title",
              },
              description: "first description",
              image: {
                url: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                accessibilityText: "first alt",
              },
              title: "first title",
            },
            {
              optionInfo: {
                key: "second",
              },
              description: "second description",
              image: {
                url: "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                accessibilityText: "second alt",
              },
              title: "second title",
            },
          ],
        },
      };

      this.actualResponse = (this.handler as any).getBody(this.responseResults);
    });

    it("returns body with SelectCarousel", async function(this: CurrentThisContext) {
      expect(this.actualResponse).toEqual(carouselResponse as DialogflowInterface.WebhookResponse<DialogflowResponse>);
    });
  });

  describe("GoogleList", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.responseResults = {
        voiceMessage: { isSSML: false, text: "Choose a item" },
        googleList: {
          title: "Hello",
          items: [
            {
              optionInfo: {
                key: "first title key",
              },
              description: "first description",
              image: {
                url: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                accessibilityText: "first alt",
              },
              title: "first title",
            },
            {
              optionInfo: {
                key: "second",
              },
              description: "second description",
              image: {
                url: "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                accessibilityText: "second alt",
              },
              title: "second title",
            },
          ],
        },
      };

      this.actualResponse = (this.handler as any).getBody(this.responseResults);
    });

    it("returns Body with List", async function(this: CurrentThisContext) {
      expect(this.actualResponse).toEqual(listResponse as DialogflowInterface.WebhookResponse<DialogflowResponse>);
    });
  });
});
