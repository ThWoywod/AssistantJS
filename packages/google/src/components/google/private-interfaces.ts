import { GoogleInterface, GoogleRequestContext } from "./public-interfaces";

export namespace Configuration {
  /** Configuration defaults -> all of these keys are optional for user */
  // tslint:disable-next-line:no-empty-interface
  export interface Defaults {}

  /** Required configuration options, no defaults are used here */
  // tslint:disable-next-line:no-empty-interface
  export interface Required {}

  /** Available configuration settings in a runtime application */
  export interface Runtime extends Defaults, Required {}
}

export type GoogleRequestContextWithInputs<Input extends GoogleInterface.Input = GoogleInterface.Input> = GoogleRequestContext & {
  body: { originalDetectIntentRequest: { payload: { inputs: Input[] } } };
};
export type GoogleRequestContextWithInputArguments = GoogleRequestContextWithInputs<GoogleInterface.Input & { arguments: GoogleInterface.Argument[] }>;
export type GoogleRequestContextWithUser = GoogleRequestContext & { body: { originalDetectIntentRequest: { payload: { user: GoogleInterface.User } } } };
export type GoogleRequestContextWithCapabilites = GoogleRequestContext & {
  body: { originalDetectIntentRequest: { payload: { surface: { capabilities: GoogleInterface.Capability[] } } } };
};

/** Name of component (to make no typos) */
export const COMPONENT_NAME = "google";
