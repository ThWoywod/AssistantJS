require("reflect-metadata");
let assistantJsCore = require("assistant-source");
let ownDescriptor = require("../../src/components/google/descriptor").descriptor;
const apiAiDescriptor = require("assistant-apiai").descriptor;
let mainState = require("../support/mocks/state").MainState;

beforeEach(function() {
  this.assistantJs = new assistantJsCore.AssistantJSSetup();
  this.specHelper = new assistantJsCore.SpecHelper(this.assistantJs);

  // Bind and configure google and apiai extension
  this.specHelper.assistantJs.registerComponent(ownDescriptor);
  this.specHelper.assistantJs.registerComponent(apiAiDescriptor);

  // Prepare all other steps
  this.specHelper.prepare([mainState]);

  this.assistantJs = this.specHelper.assistantJs;
  this.container = this.assistantJs.container;
});
