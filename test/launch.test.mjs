import assert from "node:assert/strict";
import test from "node:test";
import contribute from "../index.server.ts";

const url = "https://api.arcade.dev/mcp/example";
const request = {
  provider: "codex",
  background: false,
  purpose: "interactive",
  mcpServers: { other: { type: "http", url: "https://example.com/mcp" } },
};

function setup(read) {
  let hook;
  const cleanup = () => {};
  assert.equal(contribute({
    registerSettings: () => ({ read }),
    addHook(name, callback) {
      assert.equal(name, "agent.open.before");
      hook = callback;
      return cleanup;
    },
  }), cleanup);
  return hook;
}

test("attaches only the chosen gateway and retains existing contributions", async () => {
  const hook = setup(async () => ({ status: "ready", values: { url } }));
  assert.deepEqual(await hook({ request }), {
    ...request,
    mcpServers: {
      ...request.mcpServers,
      paseo_arcade_gateway: { type: "http", url },
    },
  });
  for (const overrides of [{ provider: "claude" }, { background: true }, { purpose: "history" }]) {
    assert.equal(await hook({ request: { ...request, ...overrides } }), undefined);
  }
});

test("keeps launch available with unset, invalid, or unreadable settings", async () => {
  for (const read of [
    async () => ({ status: "ready", values: { url: "" } }),
    async () => ({ status: "invalid" }),
    async () => { throw new Error("unavailable"); },
  ]) {
    assert.equal(await setup(read)({ request }), undefined);
  }
});
