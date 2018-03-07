import { ComponentDescriptor} from "inversify-components";
import { PlatformGenerator } from "assistant-source";

import { GeneratorUtteranceTemplateService } from "./service";

export const descriptor: ComponentDescriptor = {
  name: "generic-utterances",
  bindings: {
    root: (bindService, lookupService) => {
      bindService.bindExtension<PlatformGenerator.UtteranceTemplateService>(lookupService.lookup("core:unifier").getInterface("utteranceTemplateService")).to(GeneratorUtteranceTemplateService);
    },
  }
};