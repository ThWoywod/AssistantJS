import { ComponentDescriptor } from "inversify-components";
import { RequestExtractor } from "assistant-source";
import { Extractor } from "./extractor";
import { GoogleHandle } from "./handle";
import { Configuration } from "./private-interfaces";


export let descriptor: ComponentDescriptor<Configuration.Defaults> = {
  name: "google",
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
