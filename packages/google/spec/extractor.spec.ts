import { componentInterfaces } from "assistant-source/lib/components/unifier/private-interfaces";
import { GoogleRequestContext } from "../src/assistant-google";
import { Extractor } from "../src/components/google/extractor";
import { validRequestContext } from "./support/mocks/request-context";

describe("RequestExtractor", function() {
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
      temporalAuthToken: "my-google-user-id",
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
  });
});
