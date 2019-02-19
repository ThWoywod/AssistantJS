// tslint:disable-next-line
require("reflect-metadata");

import { descriptor as apiAiDescriptor } from "assistant-apiai";
import { AssistantJSSetup, SpecHelper } from "assistant-source";
import { descriptor } from "../../src/components/google/descriptor";
import { MainState } from "../support/mocks/state";
import { ThisContext } from "../support/this-context";

beforeEach(function(this: ThisContext) {
  this.assistantJs = new AssistantJSSetup();
  this.specHelper = new SpecHelper(this.assistantJs);

  // Bind and configure google and apiai extension
  this.specHelper.assistantJs.registerComponent(descriptor);
  this.specHelper.assistantJs.registerComponent(apiAiDescriptor);

  // Prepare all other steps
  this.specHelper.prepare([MainState]);

  this.assistantJs = this.specHelper.assistantJs;
  this.container = this.assistantJs.container;
});
