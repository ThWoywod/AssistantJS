/** Names of injectionable services, leads to fewer typing errors for most important injections */
export const componentInjectionNames = {
  /**
   * Inject an instance of @type {Component<Configuration.Runtime>}
   */
  googleComponent: "meta:component//google",
  /**
   * Inject an instance of @type {GoogleHandler}
   */
  googleResponseHandler: "google:current-response-handler",
};
