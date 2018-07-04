import { RequestProxy, withServer } from "../../support/util/requester";

describe("ServerApplication", function() {
  let request: RequestProxy;
  let stopServer: Function;

  beforeEach(async function(done) {
    [request, stopServer] = await withServer(this.assistantJs);
    done();
  });

  afterEach(function() {
    stopServer();
  });

  describe("execute", function() {
    it("responds to empty requests with 404", async function(done) {
      request.get("/any-given-route").then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });
  });
});
