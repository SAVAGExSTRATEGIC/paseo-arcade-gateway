import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";
import { isGatewayUrl } from "./gateway.ts";

export const preferences = defineSettings({
  id: "gateway",
  scope: "host",
  version: 1,
  schema: z.object({
    url: z.string().refine((url) => url === "" || isGatewayUrl(url)).default(""),
  }),
});
