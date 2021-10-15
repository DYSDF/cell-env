/* global describe it */

import chai from "chai";
import Env from "../src/env";

chai.should();

type KVMap = Record<string, any>;

function createEnv(options: KVMap, URL: string, G: KVMap): KVMap {
  return Env(options, {
    global: G,
    url: URL
  } as any);
}

describe("env", () => {
  describe("#env", () => {
    it("basic usage.", done => {
      const env = createEnv(
        {
          "is-protected": Env.protect('protected value'),
          "is-boolean": false,
          "is-number": 3000,
          "is-string": "somethings",
          "is-from": {
            def: "default"
          },
          "is-default": {
            def: true
          }
        },
        "?is-from=url&is-protected=no-protect",
        {
          "is-from": "global",
          "is-protected": "no-protect"
        }
      );

      env["is-protected"].should.to.be.eq('protected value');
      env["is-boolean"].should.to.be.false;
      env["is-number"].should.to.be.equal(3000);
      env["is-string"].should.to.be.equal('somethings');
      env["is-from"].should.to.be.equal('url');
      env["is-default"].should.to.be.true;
      done();
    });
  });
});
