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

/** Name of component (to make no typos) */
export const COMPONENT_NAME = "google";
