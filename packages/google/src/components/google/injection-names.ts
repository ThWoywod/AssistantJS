/** Names of injectionable services, leads to fewer typing errors for most important injections */
export const googleInjectionNames = {
  /**
   * Inject an instance of @type {Component<Configuration.Runtime>}
   */
  component: "meta:component//google",
  /**
   * Namespace for services which are only available in the request scope.
   */
  current: {
    /**
     * Inject an instance of @type {GoogleHandler}
     */
    responseHandler: "google:current-response-handler",
  },
};
