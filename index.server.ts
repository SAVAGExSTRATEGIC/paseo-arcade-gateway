import type { PluginServerContext } from "@getpaseo/plugin/server";
import { serverName } from "./shared/gateway.ts";
import { preferences } from "./shared/preferences.ts";

export default function contribute(server: PluginServerContext) {
  const settings = server.registerSettings(preferences);

  return server.addHook("agent.open.before", async ({ request }) => {
    if (request.provider !== "codex" || request.background || request.purpose !== "interactive") {
      return;
    }

    const current = await settings.read().catch(() => undefined);
    if (current?.status !== "ready" || !current.values.url) {
      return;
    }

    return {
      ...request,
      mcpServers: {
        ...request.mcpServers,
        [serverName]: { type: "http", url: current.values.url },
      },
    };
  });
}
