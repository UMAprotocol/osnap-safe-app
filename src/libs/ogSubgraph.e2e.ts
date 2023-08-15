// this wont run unless tsconfig is set from "module": "esnext" to module: commonjs
import test from "tape";

import { Client } from "./ogSubgraph";

const testSafe = "0x504323601078746bCDf2AC517BF80f7736853c2e";
const moduleAddress = "0x9655Dd68bA1b3D2b6d49Ea67b6b405C2cA1615fD";

test("ogSubgraph", (t) => {
  t.test("getModuleAddress", async (t) => {
    const client = Client(5);
    const address = await client.getModuleAddress(testSafe);
    t.equals(address, moduleAddress);
    t.end();
  });
  t.test("isEnabled", async (t) => {
    const client = Client(5);
    const enabled = await client.isEnabled(testSafe);
    t.ok(enabled);
    t.end();
  });
});
