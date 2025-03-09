"use client";

// import { ClerkProvider } from "@clerk/nextjs";
import { SchematicProvider } from "@schematichq/schematic-react";
import SchematicWrapped from "./SchematicWrapped";
import ConvexClientProvider from "./ConvexClientProvider";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import StoreProvider from "@/app/StoreProvider";

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
    <ConvexClientProvider>
      <SchematicProvider publishableKey={schematicKey}>
        <SchematicWrapped>
          <SignedOut>{children}</SignedOut>
          <SignedIn>
            <StoreProvider>{children}</StoreProvider>
          </SignedIn>
        </SchematicWrapped>
      </SchematicProvider>
    </ConvexClientProvider>
  );
}
