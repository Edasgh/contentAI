"use server";

import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const client = new SchematicClient({
  apiKey: String(process.env.SCHEMATIC_API_SECRET),
});

export async function getTemporaryAccessToken() {
    const user = await currentUser();

    if(!user) return null;

    const response = await client.accesstokens.issueTemporaryAccessToken({
        resourceType:"company",
        lookup:{
            id:user.id
        }
    })


    return response.data.token;

}