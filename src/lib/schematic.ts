import { SchematicClient } from "@schematichq/schematic-typescript-node";

if (!process.env.SCHEMATIC_API_SECRET) {
  throw new Error("SCHEMATIC_API_SECRET is not set");
}

export const client = new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_SECRET,
  cacheProviders: { flagChecks: [] },
});
