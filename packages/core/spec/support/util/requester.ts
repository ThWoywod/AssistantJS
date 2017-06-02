import * as request from "request-promise";
export { RequestPromise } from "request-promise";
import { Container } from "ioc-container";

import { run } from "../../../src/setup";
import { ServerApplication } from "../../../src/components/root/app-server";

/** Proxy for request-promise to use in combination with running server */
export class RequestProxy {
  get(path, headers = {}) {
    return request({uri: `http://localhost:3000${path}`, simple: false, headers: headers, resolveWithFullResponse: true});
  }

  post(path, body, headers = {}) {
    return request.post({uri: `http://localhost:3000${path}`, simple: false, body: body, headers: headers, resolveWithFullResponse: true, json: true});
  }
}

export function withServer(container: Container): Promise<[RequestProxy, Function]> {
  return new Promise(resolve => {
    run(new ServerApplication((app) => {
      let stopServer = () => {
        container.inversifyInstance.unbindAll();
        app.stop();
      }
      resolve([new RequestProxy(), stopServer]);
    }), container);
  });
}