"use server";

import { getConvexClient } from "@/lib/convex";
import { currentUser } from "@clerk/nextjs/server";
const IMG_SIZE = "1024x1024" as const;

const convexClient = getConvexClient();

export async function ImgGeneration(prompt:string,videoId:string) {
const user = await currentUser();

if (!user?.id) {
  throw new Error("User not found!");
}




}
