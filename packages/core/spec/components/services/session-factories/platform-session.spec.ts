import { injectionNames, OptionalExtractions } from "../../../../src/assistant-source";
import { PlatformSession } from "../../../../src/components/services/session-factories/platform-session";
import { BasicSessionHandable } from "../../../../src/components/unifier/response-handler";
import { createRequestScope } from "../../../support/util/setup";
import { ThisContext } from "../../../this-context";

interface CurrentThisContext extends ThisContext {
  handler: BasicSessionHandable<any>;
  extractionData: OptionalExtractions.SessionData;
  session: PlatformSession;
  params: any;

  /** Re-creates this.session based on this.handlerData and this.extractionData */
  createSession(): void;

  /** Re-creates this.session with filled session store */
  createFilledSession(): void;
}

describe("PlatformSession", function() {
  beforeEach(async function(this: CurrentThisContext) {
    createRequestScope(this.specHelper);

    this.handler = this.container.inversifyInstance.get(injectionNames.current.responseHandler);
    this.extractionData = { sessionData: null };

    this.createSession = () => {
      this.session = new PlatformSession(this.extractionData, this.handler);
    };

    this.createFilledSession = () => {
      this.extractionData = { sessionData: '{ "key": "value" }' };
      this.createSession();
    };

    // Initialize this.session
    this.createSession();

    this.params = {};
  });

  describe("with no handler data set", function() {
    describe("with no extraction data set", function() {
      it("internal session store doesn't exist", async function(this: CurrentThisContext) {
        expect(await this.session.exists()).toBeFalsy();
      });
    });

    describe("with some extraction data", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.createFilledSession();
      });

      it("loads extraction data into internal session store", async function(this: CurrentThisContext) {
        expect(await this.session.get("key")).toEqual("value");
      });

      it("marks the session as existing", async function(this: CurrentThisContext) {
        expect(await this.session.exists()).toBeTruthy();
      });
    });

    describe("with deep stringifyed json structure in data", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.params.nestedData = JSON.stringify({ array: [{ nested: "nestedValue" }] });
        this.extractionData = { sessionData: JSON.stringify({ key: this.params.nestedData }) };
        this.createSession();
      });

      it("loads nested structure as string", async function(this: CurrentThisContext) {
        expect(await this.session.get("key")).toEqual(this.params.nestedData);
        expect(typeof (await this.session.get("key"))).toBe("string");
      });
    });
  });

  describe("with handler data set", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.handler.setSessionData('{ "handlerKey": "handlerValue" }');
      this.createSession();
    });

    describe("with no extraction data", function() {
      it("loads handler data into internal session store", async function(this: CurrentThisContext) {
        expect(await this.session.get("handlerKey")).toEqual("handlerValue");
      });

      it("does not touch the extraciton", async function(this: CurrentThisContext) {
        expect(this.extractionData.sessionData).toBeNull();
      });

      describe("with deep stringifyed json structure in data", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.nestedData = JSON.stringify({ array: [{ nested: "nestedValue" }] });
          this.handler.setSessionData(JSON.stringify({ key: this.params.nestedData }));
          this.createSession();
        });

        it("loads nested structure as string", async function(this: CurrentThisContext) {
          expect(await this.session.get("key")).toEqual(this.params.nestedData);
          expect(typeof (await this.session.get("key"))).toBe("string");
        });
      });
    });

    describe("with extraction data set", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.createFilledSession();
      });

      it("loads handler data into internal session store", async function(this: CurrentThisContext) {
        expect(await this.session.get("handlerKey")).toEqual("handlerValue");
      });

      it("does not touch the extraciton", async function(this: CurrentThisContext) {
        expect(this.extractionData.sessionData).toEqual('{ "key": "value" }');
      });
    });
  });

  describe("with a prefilled session", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.params.concurrentSession = new PlatformSession(this.extractionData, this.handler);
      this.createFilledSession();
    });

    describe("after a change ommited", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.session.set("test", "test");
      });

      it("enables new session instance to reflect this change", async function(this: CurrentThisContext) {
        const newSession = new PlatformSession(this.extractionData, this.handler);
        expect(await newSession.get("test")).toEqual("test");
      });

      it("enables simultanous instances to reflect this change", async function(this: CurrentThisContext) {
        expect(await this.params.concurrentSession.get("test")).toEqual("test");
      });
    });
  });

  describe("#get", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.createFilledSession();
    });

    describe("when given field exists", function() {
      it("returns value of field", async function(this: CurrentThisContext) {
        expect(await this.session.get("key")).toEqual("value");
      });
    });

    describe("when given field does not exist", function() {
      it("returns undefined", async function(this: CurrentThisContext) {
        expect(await this.session.get("key2")).toBeUndefined();
      });
    });
  });

  describe("#set", function() {
    describe("with empty session store", function() {
      it("initializes session store with first element", async function(this: CurrentThisContext) {
        await this.session.set("test", "test");
        expect(await this.session.get("test")).toEqual("test");
      });
    });

    describe("with filled session store", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.createFilledSession();
      });

      it("adds something to store", async function(this: CurrentThisContext) {
        await this.session.set("test", "test");
        expect(await this.session.get("test")).toEqual("test");
      });

      it("can change existing entries", async function(this: CurrentThisContext) {
        await this.session.set("key", "v2");
        expect(await this.session.get("key")).toEqual("v2");
      });

      it("touches handler afterwards", async function(this: CurrentThisContext) {
        await this.session.set("key", "v2");
        expect(await this.handler.getSessionData()).toEqual(JSON.stringify({ key: "v2" }));
      });
    });
  });

  describe("#listKeys", function() {
    describe("with empty session store", function() {
      describe("without parameter", function() {
        it("returns empty array", async function(this: CurrentThisContext) {
          expect(await this.session.listKeys()).toEqual([]);
        });
      });

      describe("with parameter 'key-1'", function() {
        it("returns empty array", async function(this: CurrentThisContext) {
          expect(await this.session.listKeys("key-1")).toEqual([]);
        });
      });
    });

    describe("with filled session store", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.session.set("data-key-1", "data-value-1");
        await this.session.set("data-key-2", "data-value-2");
      });

      describe("without parameter", function() {
        it("returns all session data keys", async function(this: CurrentThisContext) {
          expect(await this.session.listKeys()).toEqual(["data-key-1", "data-key-2"]);
        });
      });

      describe("with parameter 'key-1'", function() {
        it("returns an array with data-key-1 value", async function(this: CurrentThisContext) {
          expect(await this.session.listKeys("key-1")).toEqual(["data-key-1"]);
        });
      });

      describe("with parameter 'data-key'", function() {
        it("returns all session store data keys", async function(this: CurrentThisContext) {
          expect(await this.session.listKeys("data-key")).toEqual(["data-key-1", "data-key-2"]);
        });
      });
    });
  });

  describe("#getSubset", function() {
    describe("with empty session store", function() {
      describe("with parameter ''", function() {
        it("returns an empty hash", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset("")).toEqual({});
        });
      });

      describe("without parameter", function() {
        it("returns an empty hash", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset()).toEqual({});
        });
      });

      describe("with parameter 'key-1'", function() {
        it("returns an empty hash", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset("key-1")).toEqual({});
        });
      });
    });

    describe("with filled session store", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.session.set("data-key-1", "data-value-1");
        await this.session.set("data-key-2", "data-value-2");
      });

      describe("with parameter ''", function() {
        it("return all stored session data", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset("")).toEqual({ "data-key-1": "data-value-1", "data-key-2": "data-value-2" });
        });
      });

      describe("without parameter", function() {
        it("return all stored session data", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset()).toEqual({ "data-key-1": "data-value-1", "data-key-2": "data-value-2" });
        });
      });

      describe("with parameter 'key-1'", function() {
        it("returns an hash with data-key-1 value", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset("key-1")).toEqual({ "data-key-1": "data-value-1" });
        });
      });

      describe("with parameter 'data-key'", function() {
        it("returns a hash with data-key-1 and data-key-2 value", async function(this: CurrentThisContext) {
          expect(await this.session.getSubset("data-key")).toEqual({ "data-key-1": "data-value-1", "data-key-2": "data-value-2" });
        });
      });
    });
  });

  describe("#delete", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.createFilledSession();
    });

    describe("with only one element in store", function() {
      it("removes sth from store", async function(this: CurrentThisContext) {
        expect(await this.session.get("key")).toEqual("value");
        await this.session.delete("key");
        expect(await this.session.get("key")).toBeUndefined();
      });
    });

    describe("with multiple elements in store", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.session.set("key2", "val2");
      });

      it("removes only this element from store", async function(this: CurrentThisContext) {
        await this.session.delete("key");
        expect(await this.session.get("key")).toBeUndefined();
        expect(await this.session.get("key2")).toEqual("val2");
      });
    });

    it("touches handler afterwards", async function(this: CurrentThisContext) {
      expect(await this.session.get("key")).toEqual("value");
      await this.session.delete("key");
      expect(await this.handler.getSessionData()).toEqual("{}");
    });
  });

  describe("#deleteAllFields", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.createFilledSession();
    });

    it("resets store", async function(this: CurrentThisContext) {
      await this.session.deleteAllFields();
      expect(await this.handler.getSessionData()).toEqual("{}");
    });
  });
});
