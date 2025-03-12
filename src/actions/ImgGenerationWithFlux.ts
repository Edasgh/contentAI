"use server";

import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";

const IMAGE_SIZE = "1792x1024" as const;
const convexClient = getConvexClient();

export const dalleImageGeneration = async (prompt: string, videoId: string) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  function generateRandomNum(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }
  const randomSeed = generateRandomNum();

  if (!prompt) {
    throw new Error("Failed to generate image prompt");
  }

  console.log("🎨 Generating image with prompt:", prompt);

  const width = 1792;
  const height = 1024;
  // Each seed generates a new image variation
  const model = "flux"; // Using 'flux' as  model

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${randomSeed}&model=${model}`;

  // console.log(imageUrl);

  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  // Step 1: Get a short-lived upload URL for Convex
  console.log("📤 Getting upload URL...");
  const postUrl = await convexClient.mutation(api.images.generateuploadUrl);
  console.log("✅ Got upload URL");

  // Step 2: Download the image from the URL
  console.log("⬇️ Downloading image from pollination...");
  const image: Blob = await fetch(imageUrl).then((res) => res.blob());
  console.log("✅ Downloaded image successfully");

  // Step 3: Upload the image to the convex storage bucket
  console.log("📁 Uploading image to storage...");
  const result = await fetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": image!.type },
    body: image,
  });

  const { storageId } = await result.json();
  console.log("✅ Uploaded image to storage with ID:", storageId);

  // Step 4: Save the newly allocated storage id to the database
  console.log("💾 Saving image reference to database...");
  await convexClient.mutation(api.images.storeImg, {
    storageId: storageId,
    videoId,
    userId: user.id,
  });
  console.log("✅ Saved image reference to database");

  // get serve image url
  const dbImageUrl = await convexClient.query(api.images.getImage, {
    videoId,
    userId: user.id,
  });

  // Track the image generation event
  await client.track({
    event: featureFlagEvents[FeatureFlag.IMG_GENERATION].event,
    company: {
      id: user.id,
    },
    user: {
      id: user.id,
    },
  });

  return {
    imageUrl: dbImageUrl,
  };
};
