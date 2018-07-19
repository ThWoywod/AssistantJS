import { intent as Intent, PlatformSpecHelper, RequestContext, SpecHelper } from "assistant-source";
import { GoogleHandler } from "./components/google/handler";
import { Extraction, GoogleSpecificHandable, GoogleSpecificTypes } from "./components/google/public-interfaces";

export class GoogleSpecHelper implements PlatformSpecHelper<GoogleSpecificTypes, GoogleSpecificHandable<GoogleSpecificTypes>> {
  constructor(public specSetup: SpecHelper) {}

  public async pretendIntentCalled(intent: Intent, autoStart = true, additionalExtractions = {}, additionalContext = {}) {
    const extraction: Extraction = {
      platform: "google",
      intent,
      sessionID: "apiai-mock-session-id",
      sessionData: '{"mock-google-user-key":"my-google-user-value"}',
      language: "en",
      spokenText: "this is the spoken text",
      oAuthToken: "mock-google-oauth",
      temporalAuthToken: "mock-google-temporal-auth",
      device: "phone",
      additionalParameters: {},
      ...additionalExtractions,
    };

    const context: RequestContext = {
      id: "my-request-id",
      method: "POST",
      path: "/apiai",
      body: {},
      headers: {},
      responseCallback: () => {},
      ...additionalContext,
    };

    this.specSetup.createRequestScope(extraction, context);

    // Bind handler as singleton
    this.specSetup.setup.container.inversifyInstance.unbind("google:current-response-handler");
    this.specSetup.setup.container.inversifyInstance
      .bind("google:current-response-handler")
      .to(GoogleHandler)
      .inSingletonScope();

    // auto run machine if wanted
    if (autoStart) {
      await this.specSetup.runMachine();
    }

    return this.specSetup.setup.container.inversifyInstance.get<GoogleSpecificHandable<GoogleSpecificTypes>>("google:current-response-handler");
  }
}
