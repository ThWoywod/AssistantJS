import { ApiAISpecificHandable, ApiAiSpecificTypes, ExtractionInterface as ApiAiExtraction } from "assistant-apiai";
import { OptionalExtractions } from "assistant-source";
import { TableCard } from "./conversation-interface";
import { Configuration } from "./private-interfaces";

/** Configuration of google component */
export interface GoogleConfiguration extends Partial<Configuration.Defaults>, Configuration.Required {}

/** Property describing the configuration of the google component */
export interface GoogleConfigurationAttribute {
  google?: GoogleConfiguration;
}

/** Possible devices this extractor can return */
export type Device = "phone" | "speaker";

export interface Extraction
  extends ApiAiExtraction,
    OptionalExtractions.SessionData,
    OptionalExtractions.Device,
    OptionalExtractions.TemporalAuth,
    OptionalExtractions.OAuth {}

/**
 * Add custom types here
 */
export interface GoogleSpecificTypes extends ApiAiSpecificTypes {
  googleTable: TableCard;
  card: {
    title: string;
    subTitle?: string;
    description: string;
    cardImage?: string;
    cardAccessibilityText?: string;
  };
}

/**
 * Add custom methods for here
 */
export interface GoogleSpecificHandable<CustomTypes extends GoogleSpecificTypes> extends ApiAISpecificHandable<CustomTypes> {}
