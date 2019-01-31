import {
  AccountLinkingStatus,
  HandlerProxyFactory,
  injectionNames,
  intent as Intent,
  PlatformSpecHelper,
  RequestContext,
  SpecHelper,
  UnsupportedFeatureSupportForHandables,
} from "assistant-source";
import { GoogleHandler } from "./components/google/handler";
import { googleInjectionNames } from "./components/google/injection-names";
import { Extraction, GoogleSpecificHandable, GoogleSpecificTypes } from "./components/google/public-interfaces";

export class GoogleSpecHelper implements PlatformSpecHelper<GoogleSpecificTypes, GoogleSpecificHandable<GoogleSpecificTypes>> {
  constructor(public specHelper: SpecHelper) {}

  public async pretendIntentCalled(
    intent: Intent,
    additionalExtractions: Partial<Extraction> = {},
    additionalContext = {}
  ): Promise<GoogleSpecificHandable<GoogleSpecificTypes>> {
    const extraction: Extraction = {
      intent,
      platform: "google",
      sessionID: "apiai-mock-session-id",
      sessionData: '{"mock-google-user-key":"my-google-user-value"}',
      language: "en",
      spokenText: "this is the spoken text",
      oAuthToken: "mock-google-oauth",
      accountLinkingStatus: AccountLinkingStatus.OK,
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
      // tslint:disable-next-line:no-empty
      responseCallback: () => {},
      ...additionalContext,
    };

    this.specHelper.createRequestScope(extraction, context);

    // Bind handler as singleton
    this.specHelper.assistantJs.container.inversifyInstance.unbind(googleInjectionNames.current.responseHandler);
    this.specHelper.assistantJs.container.inversifyInstance
      .bind(googleInjectionNames.current.responseHandler)
      .to(GoogleHandler)
      .inSingletonScope();

    const proxyFactory = this.specHelper.assistantJs.container.inversifyInstance.get<HandlerProxyFactory>(injectionNames.handlerProxyFactory);

    const currentHandler = this.specHelper.assistantJs.container.inversifyInstance.get<
      GoogleSpecificHandable<GoogleSpecificTypes> & UnsupportedFeatureSupportForHandables
    >(googleInjectionNames.current.responseHandler);

    const proxiedHandler = proxyFactory.createHandlerProxy(currentHandler);

    return proxiedHandler;
  }
}
