import { ResponseFactory, State } from "assistant-source";
import { injectable, inject } from "inversify";

@injectable()
export class MainState implements State.Required {
  responseFactory: ResponseFactory;

  constructor(@inject("core:unifier:current-response-factory") factory: ResponseFactory) {
    this.responseFactory = factory;
  }

  async unhandledGenericIntent() {
    this.responseFactory.createSimpleVoiceResponse().endSessionWith("Hello from google!");
  }

  unansweredGenericIntent() {
    this.responseFactory.createAndSendEmptyResponse();
  }
}