import { unifierInterfaces } from "assistant-source";
import { Extraction as ApiAiExtraction, HandlerInterface as ApiAiHandler } from "assistant-apiai";

export interface Extraction extends 
  ApiAiExtraction,
  unifierInterfaces.OptionalExtractions.OAuthExtraction {}

export interface HandlerInterface extends
  ApiAiHandler,
  unifierInterfaces.OptionalHandlerFeatures.SSMLHandler,
  unifierInterfaces.OptionalHandlerFeatures.AuthenticationHandler {}