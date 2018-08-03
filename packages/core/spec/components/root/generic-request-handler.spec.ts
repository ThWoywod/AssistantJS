import { Container } from "inversify-components";
import { RequestContext } from "../../../src/components/root/public-interfaces";
import { configureI18nLocale } from "../../support/util/i18n-configuration";
import { RequestProxy, withServer } from "../../support/util/requester";

describe("GenericRequestHelper", function() {
  beforeEach(async function() {
    // Remove emitting of warnings
    this.specHelper.bindSpecLogger("error");

    configureI18nLocale(this.container);
  });

  describe("resulting context object", function() {
    let request: RequestProxy;
    let stopServer: () => void;
    const diContextName = "core:root:current-request-context";

    beforeEach(async function(done) {
      [request, stopServer] = await withServer(this.assistantJs);
      await request.post("/any-given-route", { a: "b" }, { "header-a": "b" });
      done();
    });

    afterEach(function() {
      stopServer();
    });

    it("is fetchable via dependency injection", function() {
      expect(() => {
        (this.container as Container).inversifyInstance.get<RequestContext>(diContextName);
      }).not.toThrow();
    });

    it("contains all request information", function() {
      const requestContext = (this.container as Container).inversifyInstance.get<RequestContext>(diContextName);

      // Multiple expections for performance reasons
      expect(requestContext.method).toBe("POST");

      expect(requestContext.headers).toEqual(jasmine.objectContaining({ "header-a": "b" } as any));
      expect(requestContext.body).toEqual({ a: "b" });
      expect(requestContext.path).toBe("/any-given-route");
    });
  });
});
