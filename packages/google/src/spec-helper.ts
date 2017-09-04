import { Component } from "inversify-components";
import { SpecSetup, unifierInterfaces, rootInterfaces } from "assistant-source";

import { Extraction, HandlerInterface } from "./components/google/interfaces";
import { GoogleHandle } from "./components/google/handle";

export class SpecHelper implements unifierInterfaces.PlatformSpecHelper {
  specSetup: SpecSetup

  constructor(assistantSpecSetup: SpecSetup) {
    this.specSetup = assistantSpecSetup;
  }

  async pretendIntentCalled(intent: unifierInterfaces.intent, autoStart = true, additionalExtractions = {}, additionalContext = {}): Promise<HandlerInterface> {
    let extraction: Extraction = Object.assign({
      component: this.specSetup.setup.container.inversifyInstance.get<Component>("meta:component//google"),
      intent: intent,
      sessionID: "apiai-mock-session-id",
      language: "en",
      spokenText: "this is the spoken text",
      oAuthToken: "mock-google-oauth",
      temporalAuthToken: "mock-google-temporal-auth"
    }, additionalExtractions);

    let context: rootInterfaces.RequestContext = Object.assign({
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