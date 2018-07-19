import { injectionNames, State } from "assistant-source";
import { inject, injectable } from "inversify";
import { GoogleSpecificHandable, GoogleSpecificTypes } from "../../../src/assistant-google";

@injectable()
export class MainState implements State.Required {
  constructor(@inject(injectionNames.current.responseHandler) private handler: GoogleSpecificHandable<GoogleSpecificTypes>) {}

  public async unhandledGenericIntent() {
    this.handler.endSessionWith("Hello from google!");
  }

  public async unansweredGenericIntent() {
    await this.handler.send();
  }
}
