# Arcade Gateway for Paseo

A community plugin by SAVAGE for connecting your own Arcade MCP gateway to interactive Codex sessions in Paseo. Requires Paseo 0.17.4 or newer, Codex on the Paseo host, and an Arcade gateway that supports MCP OAuth.

## Install and connect

1. On the host running Paseo, enter `git:SAVAGExSTRATEGIC/paseo-arcade-gateway` under **Settings → Plugins → Install from source**, or run `paseo plugin add git:SAVAGExSTRATEGIC/paseo-arcade-gateway`.
2. Open the plugin's settings, paste the gateway URL from Arcade, and save. Use a URL in the form `https://api.arcade.dev/mcp/your-gateway`.
3. Run the sign-in command shown in the plugin settings in a terminal on that host using the same Codex profile as Paseo. Complete the Arcade consent flow in your browser.
4. Open a new interactive Codex session and ask it to list the tools from `paseo_arcade_gateway`. Try a read-only tool you recognize to verify access.

See [Arcade's gateway setup](https://docs.arcade.dev/en/get-started/quickstarts/call-tool-client) for setting up the gateway and its permissions.

## Data and access

The plugin stores one gateway URL in Paseo's host settings. After you save it, the plugin attaches the endpoint at launch to interactive sessions using Paseo's built-in Codex provider. Codex handles the OAuth flow and sends MCP requests directly to Arcade. The plugin has no backend, telemetry, credential fields, or tool preapprovals.

Clearing the URL removes the connection from subsequent session launches. Reopen any running sessions that already received the gateway. To clear the saved Codex OAuth grant, use the same settings command with `mcp logout` in place of `mcp login` before clearing the URL. Manage provider grants in Arcade.

This is an independent community project. Arcade and Paseo maintain their own products.

## Development

Use Node.js 24. Run `npm ci --ignore-scripts --legacy-peer-deps`, `npm run typecheck`, and `node --test`. The development dependencies are only for local verification. Paseo provides the runtime libraries.
