import { inject, injectable, multiInject, optional } from "inversify";
import "reflect-metadata";
import { Filter, Hooks } from "../../assistant-source";
import { injectionNames } from "../../injection-names";
import { ComponentSpecificLoggerFactory, Logger } from "../root/public-interfaces";
import { filterMetadataKey } from "./filter-decorator";
import { COMPONENT_NAME, componentInterfaces } from "./private-interfaces";
import { State } from "./public-interfaces";

@injectable()
export class BeforeIntentHook {
  private state!: State.Required;
  private stateName!: string;
  private intent!: string;
  private logger: Logger;
  private filters: Filter.Required[];

  constructor(
    @inject(injectionNames.componentSpecificLoggerFactory) loggerFactory: ComponentSpecificLoggerFactory,
    @optional()
    @multiInject(componentInterfaces.filter)
    filters: Filter.Required[]
  ) {
    this.logger = loggerFactory(COMPONENT_NAME);
    this.filters = typeof filters !== "undefined" ? filters : [];
  }

  /** Hook method, the only method which will be called */
  public execute: Hooks.BeforeIntentHook = async (mode, state, stateName, intent, machine) => {
    this.logger.debug({ intent, state: stateName }, "Executing filter hook");
    this.state = state;
    this.stateName = stateName;
    this.intent = intent;

    const stateFilter = this.retrieveStateFilterFromMetadata();
    const intentFilter = this.retrieveIntentFilterFromMetadata();

    let fittingFilter: Filter.Required | undefined;
    let redirect: { state: string; intent: string; args?: any[] } | undefined;

    if (typeof stateFilter === "undefined") {
      if (typeof intentFilter === "undefined") {
        return true;
      }

      fittingFilter = this.filters.find(filter => filter.constructor === intentFilter);
      redirect = fittingFilter ? await fittingFilter.execute() : undefined;

      if (redirect) {
        await machine.transitionTo(redirect.state);
        await machine.handleIntent(redirect.intent, redirect.args);
        return false;
      }
      return false;
    }

    fittingFilter = this.filters.find(filter => filter.constructor === stateFilter);
    redirect = fittingFilter ? await fittingFilter.execute() : undefined;

    if (redirect) {
      await machine.transitionTo(redirect.state);
      await machine.handleIntent(redirect.intent, redirect.args);
      return false;
    }
    return true;
  };

  private retrieveStateFilterFromMetadata(): Filter.Constructor | undefined {
    const metadata = Reflect.getMetadata(filterMetadataKey, this.state.constructor);
    return metadata ? metadata.filter : undefined;
  }

  private retrieveIntentFilterFromMetadata(): Filter.Constructor | undefined {
    if (typeof this.intent !== "undefined" && typeof this.state[this.intent] !== "undefined") {
      const metadata = Reflect.getMetadata(filterMetadataKey, this.state[this.intent]);
      return metadata ? metadata.filter : undefined;
    }
  }
}
