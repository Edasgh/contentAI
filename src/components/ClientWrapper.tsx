"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schematicKey = String(
    process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY
  );
  if (
    schematicKey === null ||
    schematicKey === undefined ||
    schematicKey === ""
  ) {
    throw new Error("No Schematic Publishable Key found!");
  }
  return (
    <ClerkProvider>
      <SchematicProvider publishableKey={schematicKey}>
        <SchematicWrapped>{children}</SchematicWrapped>
      </SchematicProvider>
    </ClerkProvider>
  );
}
