import { ContainerImpl } from "inversify-components";
import * as express from "express";
import * as fakeRedis from "fakeredis";
import { createLogger } from "bunyan"

import { GenericRequestHandler } from "./components/root/generic-request-handler";
import { StateMachineSetup } from "./components/state-machine/setup";
import { State, Transitionable } from "./components/state-machine/public-interfaces";
import { RequestContext, Logger } from "./components/root/public-interfaces";
import { MinimalRequestExtraction, MinimalResponseHandler, intent } from "./components/unifier/public-interfaces";
import { Configuration } from "./components/services/private-interfaces";
import { ServerApplication } from "./components/root/app-server"; 

import { AssistantJSSetup } from "./setup";
import { injectionNames } from "./injection-names";

/** Used for managing multiple spec setups */
let specSetupId = 0;

/** Helper for specs, which is also useful in other npm modules */
export class SpecSetup {
  setup: AssistantJSSetup;

  constructor(originalSetup: AssistantJSSetup = new AssistantJSSetup(new ContainerImpl())) {
    this.setup = originalSetup;
  }

  /** 
   * Prepares assistant js setup 
   * @param states States to add to container
   * @param autobind If true, calls setup.autobind()
   * @param useChilds If set to false, does not set child containers
   * @param autoSetup If set to true, registers internal components
   * */
  prepare(states: State.Constructor[] = [], autoBind = true, useChilds = false, autoSetup = true) {
    this.initializeDefaultConfiguration();
    if (autoSetup) this.setup.registerInternalComponents();
    if (states.length > 0) this.registerStates(states);

    if (autoBind) this.setup.autobind();
    if (!useChilds) this.bindChildlessRequestHandlerMock();

    // Change logger unless env variable is set
    if (!(process.env.SPEC_LOGS === "true")) this.bindSpecLogger();
  }

  /**
   * Creates request scope in container manually, without firing a request.
   * @param minimalExtraction Extraction result to add to di container for scope opening. 
   * You can pass null if you don't want to pass a result.
   * @param requestContext Request context to add to di container for scope opening.
   * @param responseHandler If given, this handler is bound to minimalExtraction.component.name + ":current-response-handler.
   * Does  not work with minimalExtraction being null
   */
  createRequestScope(minimalExtraction: MinimalRequestExtraction | null, requestContext: RequestContext, responseHandler?: { new(...args: any[]): MinimalResponseHandler }) {
    // Get request handle instance and create child container of it
    let requestHandle = this.setup.container.inversifyInstance.get(GenericRequestHandler);
    let childContainer = requestHandle.createChildContainer(this.setup.container);

    // Bind request context
    requestHandle.bindContextToContainer(requestContext, childContainer, "core:root:current-request-context");

    // Add minimal extraction if wanted
    if (minimalExtraction !== null) {
      requestHandle.bindContextToContainer(minimalExtraction, childContainer, "core:unifier:current-extraction", true);
    }

    // Add minimal response handler
    if (typeof responseHandler !== "undefined") {
      if (minimalExtraction !== null) {
        childContainer.bind<MinimalResponseHandler>(minimalExtraction.platform + ":current-response-handler").to(responseHandler);
      }
      else {
        throw new Error("You cannot pass a null value for minimalExtraction but expecting a responseHandler to bind");
      }
    }

    // Open request scope
    this.setup.container.componentRegistry.autobind(childContainer, [], "request", requestContext);
  }

  /** 
   * Runs state machine. Needs request scope opened!
   * @param stateName Name of state to run. If not passed, uses state in session 
   * @param intent Name of intent to run. If not passed, uses extracted intent
   */
  async runMachine(stateName?: string, intent?: intent) {
    if (this.setup.container.inversifyInstance.isBound("core:unifier:current-extraction") 
    && this.setup.container.inversifyInstance.isBound("core:state-machine:current-state-machine")) {
      let machine = this.setup.container.inversifyInstance.get<Transitionable>("core:state-machine:current-state-machine")
      let extraction = this.setup.container.inversifyInstance.get<MinimalRequestExtraction>("core:unifier:current-extraction");

      if (typeof stateName !== "undefined") {
        await machine.transitionTo(stateName);
      }

      return machine.handleIntent(typeof intent === "undefined" ? extraction.intent : intent);
    } else {
      throw new Error("You cannot run machine without request scope opened. Did you call createRequestScope() or pretendIntentCalled()?");
    }
  }

  /** Registers states */
  registerStates(states: State.Constructor[]) {
    let stateMachineSetup = new StateMachineSetup(this.setup);
    states.forEach(state => stateMachineSetup.addState(state));
    stateMachineSetup.registerStates();
  }

  /**
   * Disables the usage of child container for testing purpose by appying ChildlessGenericRequestHandler
   */
  bindChildlessRequestHandlerMock() {
    this.setup.container.inversifyInstance.unbind(GenericRequestHandler);
    this.setup.container.inversifyInstance.bind(GenericRequestHandler).to(ChildlessGenericRequestHandler);
  }

  /**
   * Changes logger to a new one without any streams configured. Makes the logger silent.
   */
  bindSpecLogger() {
    this.setup.container.inversifyInstance.unbind(injectionNames.logger);
    this.setup.container.inversifyInstance.bind<Logger>(injectionNames.logger).toConstantValue(createLogger({ name: "assistantjs-testing", streams: [{ level: "error", stream: process.stdout }] }));
  }

  /** 
   * Creates a express server configured with ServerApplication.
   * @param expressApp If given, express app to use 
   * 
   * @return Promise<Function> stopFunction If you call this function, server will be stopped.
   */
  withServer(expressApp: express.Express = express()): Promise<Function> {
    return new Promise(resolve => {
      this.setup.run(new ServerApplication(3000, (app) => {
        resolve(() => { app.stop() });
      }, expressApp));
    });
  }

  /** Initialize default configuration -> changes redis to mock version */
  initializeDefaultConfiguration() {
    // Set redis instance to fake redis instance
    const serviceConfiguration: Configuration.Required = {
      redisClient: fakeRedis.createClient(6379, `redis-spec-setup-${++specSetupId}`, { fast: true })
    }
    this.setup.addConfiguration({"core:services": serviceConfiguration});
  }
}

/** 
 * This is an implementation of GenericRequestHandle which DOES NOT spawn a child container,
 * but uses the parent container instead. Nice for testing.
 */
export class ChildlessGenericRequestHandler extends GenericRequestHandler {
  createChildContainer(container) {
    return container.inversifyInstance;
  }
}