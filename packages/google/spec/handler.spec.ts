import { DialogflowInterface } from "assistant-apiai";
import { SpecHelper } from "assistant-source";
import { GoogleInterface, GoogleSpecificHandable, GoogleSpecificTypes } from "../src/assistant-google";
import { GoogleSpecHelper } from "../src/spec-helper";

interface CurrentThisContext {
  specHelper: SpecHelper;
  googleSpecHelper: GoogleSpecHelper;
  handler: GoogleSpecificHandable<GoogleSpecificTypes>;
  responseResults: Partial<GoogleSpecificTypes>;
  expectedResponse: DialogflowInterface.WebhookResponse<GoogleInterface.AppResponse>;
  actualResponse: DialogflowInterface.WebhookResponse<GoogleInterface.AppResponse>;
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
          shouldAuthenticate: true,
          voiceMessage: {
            isSSML: false,
            text: "Please login first",
          },
        };

        this.expectedResponse = {};
        this.actualResponse = (this.handler as any).getBody(this.responseResults);
      });

      it("returns normal answer", async function(this: CurrentThisContext) {
        pending();
      });
    });

    describe("when authentication is necessary", function() {
      it("returns, that SignIn is needed", async function(this: CurrentThisContext) {
        pending();
      });
    });
  });

  describe("when session should end", function() {
    it("send finalResponse", async function(this: CurrentThisContext) {
      pending();
    });

    it("does not allow suggestion chips", async function(this: CurrentThisContext) {
      pending();
    });
  });

  describe("with voiceMessage", function() {
    describe("with reprompts", function() {
      it("returns both", async function(this: CurrentThisContext) {
        pending();
      });
    });

    describe("with chat bubbles", function() {
      describe("with one chat bubble", function() {
        it("returns voiceMessage with displaytext", async function(this: CurrentThisContext) {
          pending();
        });
      });

      describe("with multiple chat bubbles", function() {
        it("returns voicemessage with chat bubble and additional chat bubbles", async function(this: CurrentThisContext) {
          pending();
        });
      });
    });

    describe("witout additional infos", function() {
      it("returns only voiceMessage", async function(this: CurrentThisContext) {
        pending();
      });
    });
  });

  describe("without voiceMessage", function() {
    describe("with reprompts", function() {
      it("returns ???", async function(this: CurrentThisContext) {
        pending("Is this spec necessary?");
      });
    });
  });
});
