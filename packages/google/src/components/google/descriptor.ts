import { ComponentDescriptor } from "inversify-components";
import { unifierInterfaces } from "assistant-source";
import { Extractor } from "./extractor";
import { GoogleHandle } from "./handle";


export let descriptor: ComponentDescriptor = {
  name: "google",
  bindings: {
    root: (bindService, lookupService) => {
      bindService
        .bindExtension<unifierInterfaces.RequestConversationExtractor>(lookupService.lookup("core:unifier").getInterface("requestProcessor"))
        .to(Extractor);
    },
    request: (bindService) => {
      bindService.bindGlobalService("current-response-handler").to(GoogleHandle);
    }
  }
};
