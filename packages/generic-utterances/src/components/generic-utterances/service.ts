import { injectable, inject } from "inversify";
import { Component } from "inversify-components";
import { PlatformGenerator } from "assistant-source";
import * as fs from "fs";

@injectable()
export class GeneratorUtteranceTemplateService implements PlatformGenerator.UtteranceTemplateService {
  getUtterancesFor(language: string) {
    let utterancePath = __dirname + "/utterances/" + language + ".json";

    if (fs.existsSync(utterancePath)) {
      return JSON.parse(fs.readFileSync(utterancePath).toString());
    }

    return {};
  }
}