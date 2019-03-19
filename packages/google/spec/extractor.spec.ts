import { AccountLinkingStatus, GenericIntent } from "assistant-source";
// tslint:disable-next-line:no-submodule-imports
import { componentInterfaces } from "assistant-source/lib/components/unifier/private-interfaces";
import { authenticationCancelledRequestContext } from "./support/mocks/authentication-canceled-context";
import { validRequestContext } from "./support/mocks/request-context";

describe("RequestExtractor", function() {
  describe("with a normal request", function() {
    beforeEach(function() {
      // There is an apiai and our google extractor registerd. Filter for our extractor
      this.extractor = this.container.inversifyInstance.getAll(componentInterfaces.requestProcessor).filter(e => typeof e.googleComponent !== "undefined")[0];
      this.context = { ...validRequestContext };

      this.expectedExtraction = {
        sessionID: "my-dialogflow-session",
        sessionData: '{"my-session-key":"my-session-value"}',
        intent: "testIntent",
        entities: {},
        language: "en",
        platform: "google",
        oAuthToken: "my-access-token",
        accountLinkingStatus: AccountLinkingStatus.OK,
        spokenText: "Talk to my test app",
        device: "phone",
        additionalParameters: jasmine.any(Object),
      };
    });

    describe("extract", function() {
      it("returns correct extraction", async function(done) {
        this.extraction = await this.extractor.extract(this.context);
        expect(this.extraction).toEqual(this.expectedExtraction);
        done();
      });

      describe("with no screen capabilities", function() {
        beforeEach(function() {
          this.context.body.originalDetectIntentRequest.payload.surface.capabilities = [{ name: "actions.capability.AUDIO_OUTPUT" }];
        });

        it("sets device to speaker", async function(done) {
          this.extraction = await this.extractor.extract(this.context);
          expect(this.extraction).toEqual({ ...this.expectedExtraction, device: "speaker" });
          done();
        });
      });

      describe("with FORCED_GOOGLE_OAUTH_TOKEN environment variable given", function() {
        beforeEach(async function(done) {
          process.env.FORCED_GOOGLE_OAUTH_TOKEN = "test";
          this.extraction = await this.extractor.extract(this.context);
          done();
        });

        it("returns content of FORCED_GOOGLE_OAUTH_TOKEN as extraction result", function() {
          expect(this.extraction.oAuthToken).toEqual("test");
        });
      });

      describe("with selection", function() {
        beforeEach(async function() {
          this.context.body.queryResult.intent.isFallback = true;
          this.context.body.queryResult.intent.displayName = "__unhandled";
          this.context.body.originalDetectIntentRequest.payload!.inputs![0].intent = "actions.intent.OPTION";
          this.context.body.originalDetectIntentRequest.payload!.inputs![0].arguments = [
            {
              textValue: "my-selected-key",
              name: "OPTION",
            },
          ];

          this.extraction = await this.extractor.extract(this.context);
        });

        it("returns SelectedIntent", async function() {
          expect(this.extraction.intent).toBe(GenericIntent.Selected);
          expect(this.extraction.entities).toEqual({ selectedElement: "my-selected-key" });
        });
      });
    });
  });

  describe("after a authentication response with a canceld request", function() {
    beforeEach(async function() {
      // There is an apiai and our google extractor registerd. Filter for our extractor
      this.extractor = this.container.inversifyInstance.getAll(componentInterfaces.requestProcessor).filter(e => typeof e.googleComponent !== "undefined")[0];
      this.context = { ...authenticationCancelledRequestContext };

      this.extraction = await this.extractor.extract(this.context);
    });

    it("returns cancelled status", async function() {
      expect(this.extraction.accountLinkingStatus).toBe(AccountLinkingStatus.CANCELLED);
    });
  });
});
