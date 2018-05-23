import { Component } from "inversify-components";
import { SpecSetup, PlatformSpecHelper, intent, RequestContext } from "assistant-source";

import { Extraction, HandlerInterface } from "./components/google/public-interfaces";
import { GoogleHandle } from "./components/google/handle";

export class SpecHelper implements PlatformSpecHelper {
  specSetup: SpecSetup

  constructor(assistantSpecSetup: SpecSetup) {
    this.specSetup = assistantSpecSetup;
  }

  async pretendIntentCalled(intent: intent, autoStart = true, additionalExtractions = {}, additionalContext = {}): Promise<HandlerInterface> {
    let extraction: Extraction = Object.assign({
      platform: "google",
      intent: intent,
      sessionID: "apiai-mock-session-id",
      language: "en",
      spokenText: "this is the spoken text",
      oAuthToken: "mock-google-oauth",
      temporalAuthToken: "mock-google-temporal-auth",
      device: "phone",
      additionalParameters: {}
    }, additionalExtractions);

    let context: RequestContext = Object.assign({
      id: 'my-request-id',
      method: 'POST',
      path: '/apiai',
      body: {},
      headers: {},
      responseCallback: () => {}
    }, additionalContext);

    this.specSetup.createRequestScope(extraction, context);

    // Bind handler as singleton
    this.specSetup.setup.container.inversifyInstance.unbind("google:current-response-handler");
    this.specSetup.setup.container.inversifyInstance.bind("google:current-response-handler").to(GoogleHandle).inSingletonScope();
    
    // auto run machine if wanted
    if (autoStart) {
      await this.specSetup.runMachine();
    }
    
    return this.specSetup.setup.container.inversifyInstance.get<GoogleHandle>("google:current-response-handler");  
  }
}