import assert from "node:assert/strict";
import test from "node:test";
import { isGatewayUrl } from "../shared/gateway.ts";

test("accepts the Arcade-hosted MCP URL", () => {
  assert.equal(isGatewayUrl("https://api.arcade.dev/mcp/example-gateway_2"), true);
});

test("rejects alternate destinations and embedded credentials", () => {
  const invalidUrls = [
    "http://api.arcade.dev/mcp/example",
    "https://api.arcade.dev.example.com/mcp/example",
    "https://api.arcade.dev@elsewhere.example/mcp/example",
    "https://example:secret@api.arcade.dev/mcp/example",
    "https://api.arcade.dev/mcp/example?token=secret",
    "https://api.arcade.dev/mcp/example#secret",
    "https://api.arcade.dev/mcp/example/../other",
    "https://api.arcade.dev/mcp/example%2fother",
    "https://api.arcade.dev/mcp/example\n",
  ];
  for (const url of invalidUrls) {
    assert.equal(isGatewayUrl(url), false, url);
  }
});
