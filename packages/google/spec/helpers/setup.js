require("reflect-metadata");
let assistantJsCore = require("assistant-source");
let ownDescriptor = require("../../src/components/google/descriptor").descriptor;
const apiAiDescriptor = require("assistant-apiai").descriptor;
let mainState = require("../support/mocks/state").MainState;


beforeEach(function() {
  this.specHelper = new assistantJsCore.SpecSetup();

  // Bind and configure google and apiai extension
  this.specHelper.setup.registerComponent(ownDescriptor);
  this.specHelper.setup.registerComponent(apiAiDescriptor);

  // Prepare all other steps
  this.specHelper.prepare([mainState]);

  this.assistantJs = this.specHelper.setup;
  this.container = this.assistantJs.container;
});