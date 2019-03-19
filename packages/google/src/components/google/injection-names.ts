/** Names of injectionable services, leads to fewer typing errors for most important injections */
export const googleInjectionNames = {
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
