import { injectable, inject } from "inversify";
import { Component } from "ioc-container";
import { unifierInterfaces } from "assistant-source";

@injectable()
export class UtteranceTemplateService implements unifierInterfaces.GeneratorUtteranceTemplateService {
  private mappings: unifierInterfaces.GeneratorEntityMapping;

  constructor(@inject("core:unifier:user-entity-mappings") mappings: unifierInterfaces.GeneratorEntityMapping) {
    this.mappings = mappings;
  }

  getUtterancesFor(langauge: string) {
    return {
      answerPromptIntent: this.getUniqueMappingValues().map(type => "{{" + type + "}}")
    };
  }

  getUniqueMappingValues() {
    let values = Object.keys(this.mappings).map(key => this.mappings[key]);
    return Array.from(new Set(values));
  }
}