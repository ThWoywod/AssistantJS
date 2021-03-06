import { GenericIntent, RequestContext } from "assistant-source";
// tslint:disable-next-line:no-submodule-imports
import { componentInterfaces } from "assistant-source/lib/components/unifier/private-interfaces";
import { RequestExtractor } from "../src/components/alexa/request-extractor";
import { validRequestContext } from "./support/mocks/requests/intent-request";
import { selectedElementRequestContext } from "./support/mocks/requests/selected-element-request";

describe("RequestExtractor", function() {
  let extractor: RequestExtractor;
  let context: RequestContext;

  beforeEach(function() {
    extractor = this.container.inversifyInstance.get(componentInterfaces.requestProcessor);
    context = JSON.parse(JSON.stringify(validRequestContext));
  });

  describe("fits", function() {
    describe("with verifyAlexa proxyfied", function() {
      describe("when a valid (but signature missing) amazon request is given", function() {
        it("returns true", function() {
          return extractor.fits(context).then(result => expect(result).toBeTruthy());
        });
      });
    });

    describe("without configured applicationID", function() {
      beforeEach(function() {
        delete (extractor as any).configuration.applicationID;
      });

      it("throws error", function() {
        return extractor
          .fits(context)
          .then(result => fail())
          .catch(result => expect(true).toBeTruthy());
      });
    });

    describe("without verifyAlexa proxyfied", function() {
      beforeEach(function() {
        (extractor as any).configuration.useVerifier = true;
        extractor.verifyAlexaProxy = extractor.resolveVerifier();
      });

      describe("when a valid (but signature missing) amazon request is given", function() {
        beforeEach(async function() {
          spyOn((extractor as any).logger, "error");
        });

        it("returns true", function() {
          return extractor.fits(context).then(result => expect(result).toBeFalsy());
        });

        it("calls logger", async function() {
          return extractor.fits(context).then(result => expect((extractor as any).logger.error).toHaveBeenCalled());
        });
      });
    });

    describe("with wrong path", function() {
      beforeEach(function() {
        context.path = "/wrong-path";
      });

      it("returns false", function() {
        return extractor.fits(context).then(result => expect(result).toBeFalsy());
      });
    });

    describe("with wrong applicationId", function() {
      beforeEach(function() {
        context.body.session.application.applicationId = "wrong-applicationId";
      });

      it("returns false", function() {
        return extractor.fits(context).then(result => expect(result).toBeFalsy());
      });
    });
  });

  describe("extract", function() {
    describe("with IntentRequest", function() {
      beforeEach(async function() {
        this.extraction = await extractor.extract(context);
      });

      it("returns correct extraction", async function(done) {
        expect(this.extraction).toEqual({
          sessionID: "SessionId.d391741c-a96f-4393-b7b4-ee76c81c24d3",
          sessionData: '{"mockAttribute":"mockValue","__current_state":"mockState"}',
          intent: "test",
          entities: { entity1: "entityvalue" },
          language: "en",
          platform: extractor.component.name,
          oAuthToken: "mockOAuthToken",
          temporalAuthToken: "temporalUserId",
          requestTimestamp: "2017-06-24T16:00:18Z",
        });
        done();
      });
    });

    describe("with SelectedElementRequest", function() {
      beforeEach(async function() {
        context = JSON.parse(JSON.stringify(selectedElementRequestContext));
        this.extraction = await extractor.extract(context);
      });

      it("returns correct extraction", async function() {
        expect(this.extraction).toEqual({
          sessionID: "SessionId.d391741c-a96f-4393-b7b4-ee76c81c24d3",
          sessionData: '{"mockAttribute":"mockValue","__current_state":"mockState"}',
          intent: GenericIntent.Selected,
          entities: { selectedElement: "my-selection" },
          language: "en",
          platform: extractor.component.name,
          oAuthToken: "mockOAuthToken",
          temporalAuthToken: "temporalUserId",
          requestTimestamp: "2017-06-24T16:00:18Z",
        });
      });
    });

    describe("with FORCED_ALEXA_OAUTH_TOKEN environment variable given", function() {
      beforeEach(async function(done) {
        process.env.FORCED_ALEXA_OAUTH_TOKEN = "test";
        this.extraction = await extractor.extract(context);
        done();
      });

      it("returns content of FORCED_ALEXA_OAUTH_TOKEN as extraction result", function() {
        expect(this.extraction.oAuthToken).toEqual("test");
      });
    });
  });
});
