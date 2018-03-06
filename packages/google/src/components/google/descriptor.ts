import { ComponentDescriptor } from "inversify-components";
import { RequestExtractor } from "assistant-source";
import { Extractor } from "./extractor";
import { GoogleHandle } from "./handle";
import { Configuration, COMPONENT_NAME } from "./private-interfaces";


export let descriptor: ComponentDescriptor<Configuration.Defaults> = {
  name: COMPONENT_NAME,
  bindings: {
    root: (bindService, lookupService) => {
      bindService
        .bindExtension<RequestExtractor>(lookupService.lookup("core:unifier").getInterface("requestProcessor"))
        .to(Extractor);
    },
    request: (bindService) => {
      bindService.bindGlobalService("current-response-handler").to(GoogleHandle);
    }
  }
};
