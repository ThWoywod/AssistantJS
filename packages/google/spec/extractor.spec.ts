import { RequestContext } from "assistant-source";
import { Extractor } from "../src/components/google/extractor";
import { validRequestContext } from "./support/mocks/request-context";
import { componentInterfaces } from "assistant-source/lib/components/unifier/private-interfaces"

describe("RequestExtractor", function() {
  let extractor: Extractor;
  let context: RequestContext;

  beforeEach(function() {
    // There is an apiai and our google extractor registerd. Filter for our extractor
    extractor = this.container.inversifyInstance.getAll(componentInterfaces.requestProcessor).filter(e => typeof e.googleComponent !== "undefined")[0];
    context = Object.assign({}, validRequestContext);
  });

  describe("extract", function() {
    it("returns correct extraction", async function(done) {
      this.extraction = await extractor.extract(context);
      expect(this.extraction).toEqual({
        sessionID: "apiai-my-session-id",
        intent: "testIntent",
        entities: {},
        language: "en",
        platform: "google",
        oAuthToken: "my-access-token",
        temporalAuthToken: "my-user-id",
        spokenText: "My query"
      });
      done()
    });

    describe("with FORCED_ALEXA_OAUTH_TOKEN environment variable given", function() {
      beforeEach(async function(done) {
        process.env.FORCED_GOOGLE_OAUTH_TOKEN = "test";
        this.extraction = await extractor.extract(context);
        done();
      });

      it("returns content of FORCED_ALEXA_OAUTH_TOKEN as extraction result", function() {
        expect(this.extraction.oAuthToken).toEqual("test");
      });
    });
  });
});