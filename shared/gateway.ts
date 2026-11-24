export const serverName = "paseo_arcade_gateway";

export function isGatewayUrl(value: string): boolean {
  return /^https:\/\/api\.arcade\.dev\/mcp\/[a-zA-Z0-9_-]+$/.test(value);
}
