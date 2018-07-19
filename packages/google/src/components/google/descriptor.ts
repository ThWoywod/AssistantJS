import { RequestExtractor } from "assistant-source";
import { ComponentDescriptor } from "inversify-components";
import { Extractor } from "./extractor";
import { GoogleHandler } from "./handler";
import { COMPONENT_NAME, Configuration } from "./private-interfaces";

export let descriptor: ComponentDescriptor<Configuration.Defaults> = {
  name: COMPONENT_NAME,
  bindings: {
    root: (bindService, lookupService) => {
      bindService.bindExtension<RequestExtractor>(lookupService.lookup("core:unifier").getInterface("requestProcessor")).to(Extractor);
    },
    request: bindService => {
      bindService.bindGlobalService("current-response-handler").to(GoogleHandler);
    },
  },
};
