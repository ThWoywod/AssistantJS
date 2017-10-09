import { stateMachineInterfaces } from "assistant-source";

export interface HookContext {
  intent: string;
  state: string;
  neededEntity: string;
  redirectArguments: any[];
}

export interface PromptFactory {
  /** Creates a prompt. Needed to prompt for a parameter.
   * @param intent Name of the current intent
   * @param stateName Name of the current state
   * @param machine Reference to Transitionable object
   * @param promptStateName (optional) Name of prompt state to transition to, defaults to "PromptState"
   * @param redirectArguments (optional) Additional arguments to pass to the current state and intent
   */
  (intent: string, stateName: string, machine: stateMachineInterfaces.Transitionable, promptStateName?: string, redirectArguments?: any[]): Prompt;
}

export interface Prompt {
  /** Starts prompting for a parameter
   * @param parameter string The parameter to prompt for
   * @param tellInvokeMessage boolean If set to true (default), sends response to ask the user for the parameter
   */
  prompt(parameter: string, tellInvokeMessage?: boolean): Promise<void>;
}

export interface OptionalConfiguration {
  defaultPromptState?: string;
}

export interface Configuration extends OptionalConfiguration {

}