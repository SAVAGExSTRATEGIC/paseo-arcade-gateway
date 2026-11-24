import { useState } from "react";
import { Text } from "react-native";
import { useSettings, type PluginClientContext } from "@getpaseo/plugin/client";
import { SettingsAction, SettingsCard, SettingsInput, SettingsSection } from "@getpaseo/plugin/client/ui";
import { isGatewayUrl, serverName } from "./shared/gateway";
import { preferences } from "./shared/preferences";

function GatewaySettings() {
  const settings = useSettings(preferences);

  if (settings.status === "loading") return <Text>Loading gateway settings…</Text>;
  if (settings.status === "invalid") {
    return (
      <SettingsSection title="Gateway">
        <SettingsCard>
          <SettingsAction label="Stored settings could not be read" actionLabel="Reset"
            disabled={settings.saving} onPress={() => void settings.reset()} />
        </SettingsCard>
      </SettingsSection>
    );
  }
  if (settings.status !== "ready") return <Text>Gateway settings are unavailable. Reopen this screen to try again.</Text>;

  return (
    <GatewayForm key={settings.revision} url={settings.values.url} saving={settings.saving}
      saveError={Boolean(settings.saveError)}
      onSave={(url) => settings.save({ url }, settings.revision)} />
  );
}

function GatewayForm({ url, saving, saveError, onSave }: {
  url: string;
  saving: boolean;
  saveError: boolean;
  onSave: (url: string) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState(url);
  const candidate = draft.trim();
  const valid = candidate === "" || isGatewayUrl(candidate);

  return (
    <SettingsSection title="Arcade gateway">
      <SettingsCard>
        <SettingsInput label="Gateway URL" initialValue={url} onChangeText={setDraft}
          placeholder="https://api.arcade.dev/mcp/your-gateway"
          hint="Copy your gateway URL from Arcade. Leave this blank to disconnect future Codex sessions."
          error={valid ? undefined : "Enter an Arcade gateway URL without a query string or credentials."} />
        <SettingsAction label="Apply to new interactive Codex sessions" actionLabel="Save"
          disabled={!valid || candidate === url || saving}
          error={saveError ? "Could not save the gateway. Try again." : undefined}
          onPress={() => void onSave(candidate)} />
      </SettingsCard>
      {url ? (
        <Text selectable>
          {`Sign in once from a terminal on this host:\ncodex -c 'mcp_servers.${serverName}.url="${url}"' mcp login ${serverName}`}
        </Text>
      ) : null}
    </SettingsSection>
  );
}

export default function contribute(client: PluginClientContext) {
  return client.addSettingsScreen({ id: "gateway", title: "Gateway", icon: "Plug", Component: GatewaySettings });
}
