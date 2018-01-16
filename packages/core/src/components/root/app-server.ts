import { MainApplication, Container } from "inversify-components";
import * as express from "express";
import { Express } from "express";
export { Express } from "express";
import * as bodyParser from "body-parser";
import Logger = require("bunyan");
const cuid = require("cuid");

import { ResponseCallback, RequestContext } from "./interfaces";
import { GenericRequestHandler } from "./generic-request-handler";

export class ServerApplication implements MainApplication {
  private port: number;
  private app: express.Express;
  private listeningCallback = (app: ServerApplication) => {};
  private expressRunningInstance;
  private logger: undefined | Logger;

  constructor (port = 3000, listeningCallback = (app: ServerApplication) => {}, expressApp: Express = express(), registerOwnMiddleware = true) {
    this.listeningCallback = listeningCallback;
    this.app = expressApp;
    this.port = port;

    if (registerOwnMiddleware) {
      this.configureExpressApp();
    }
  }

  /** Starts express server, calls handleRequest on each request */
  execute(container: Container) {
    // Set logger
    this.logger = container.inversifyInstance.get<Logger>("core:root:logger");

    this.log("Preloading i18n instance...");
    let preloadI18n = container.inversifyInstance.get("core:i18n:wrapper");

    this.log("Registering express catch all route...");
    this.app.all("*", (request, response) => {
      this.handleRequest(request, response, container);
    });

    this.log("Starting express server at port " + this.port + "...");
    this.expressRunningInstance = this.app.listen(this.port, () => {
      this.log("Server is running.");
      this.listeningCallback(this);
    });
  }

  /** Binds GenericRequestHandler to request after extracting context */
  handleRequest(request: express.Request, response: express.Response, container: Container) {
    const requestId: string = cuid();
    this.log(`Incomming request: ${request.method} ${request.path}`, requestId);

    // Create generic request context
    let requestContext: RequestContext = {
      id: requestId,
      path: request.path,
      method: request.method,
      headers: request.headers as any,
      body: request.body,
      responseCallback: this.createResponseCallback(response, requestId)
    };

    // Call express independent request handler with this context
    this.getGenericRequestHandler(container).execute(requestContext, container);
  }

  /** Returns a callback function which can be used to response to a request */
  createResponseCallback(response: express.Response, requestId: string, nanoTimestamp = process.hrtime()): ResponseCallback {
    return (body, headers, statusCode = 200) => {
      if (typeof headers !== "undefined") {
        Object.keys(headers).forEach((key) => {
          response.setHeader(key, headers[key]);
        });
      }

      this.log("Sending response with status code " + statusCode + "...", requestId);
      response.status(statusCode).send(body);
      let timeNeeded = process.hrtime(nanoTimestamp);
      this.log("Sent response. Handled request in " + (timeNeeded[0] * 1000 + timeNeeded[1]/1000000) + "ms.", requestId);
    }
  }

  /** Stops the server */
  stop() {
    if (typeof this.expressRunningInstance !== "undefined") { 
      this.expressRunningInstance.close();
      this.log("Server stopped.");
    }
  }

  /** Configures middleware for express app */
  configureExpressApp() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private getGenericRequestHandler(container: Container): GenericRequestHandler {
    return container.inversifyInstance.get(GenericRequestHandler);
  }

  /** Logs a message if logger is already defined */
  private log(message, requestId?: string) {
    if (typeof this.logger !== "undefined") {
      this.logger.info(message, typeof requestId === "undefined" ? {} : { requestId: requestId });
    }
  }
}