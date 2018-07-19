import { SpecHelper } from "assistant-source";
import { GoogleSpecificHandable, GoogleSpecificTypes } from "../src/assistant-google";
import { GoogleSpecHelper } from "../src/spec-helper";

interface CurrentThisContext {
  specHelper: SpecHelper;
  googleSpecHelper: GoogleSpecHelper;
  handler: GoogleSpecificHandable<GoogleSpecificTypes>;
  results: Partial<GoogleSpecificTypes>;
}

describe("Handler", function() {
  beforeEach(async function(this: CurrentThisContext) {
    this.googleSpecHelper = new GoogleSpecHelper(this.specHelper);
    this.handler = await this.googleSpecHelper.pretendIntentCalled("test");
    this.results = this.specHelper.getResponseResults();
  });

  it("is correctly linked to spec setup", function(this: CurrentThisContext) {
    expect(this.results.shouldSessionEnd).toBeTruthy();
    expect(this.results.voiceMessage).toBeTruthy();
    expect(this.results.voiceMessage!.text).toBe("Hello from google!");
  });

  it("cannot be executed twice", async function(this: CurrentThisContext) {
    try {
      await this.handler.send();
      fail("should throw error");
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
