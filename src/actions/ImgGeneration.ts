"use server";

import { getConvexClient } from "@/lib/convex";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { client } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
// import OpenAI from "openai";
import { createTogetherAI, togetherai } from "@ai-sdk/togetherai";
import { experimental_generateImage } from "ai";

const IMG_SIZE = "1792x1024" as const;

const convexClient = getConvexClient();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const together = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function ImgGeneration(prompt: string, videoId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found!");
  }

  const postUrl = await convexClient.mutation(api.images.generateuploadUrl);
  console.log("the upload url", postUrl);

  //   const imageResponse = await openai.images.generate({
  //     model:"dall-e-3",
  //     prompt:prompt,
  //     n:1,
  //     quality:"standard",
  //     style:"vivid"
  //   })

  //Generate the image using Together AI
  const imageResponse = await experimental_generateImage({
    model: together.image("black-forest-labs/FLUX.1-schnell-Free"),
    prompt: prompt,
    size: IMG_SIZE,
    n: 1,
  });

  console.log("Image Response : ", imageResponse);

  if (!imageResponse?.image?.base64)
    throw new Error("Failed to generate image.");

  const imgUrl = `data:image/png;base64,${imageResponse.image.base64}`;

  // download the image
  const image: Blob = await fetch(imgUrl).then((res) => res.blob());
  console.log("Downloaded image successfully!", image);

  // upload the image in convex
  const result = await fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": image!.type,
    },
    body: image,
  });

  const { storageId } = await result.json();
  console.log("Uploaded image to storage id : ", storageId);

  //save the image into db
  await convexClient.mutation(api.images.storeImg, {
    storageId: storageId,
    videoId,
    userId: user.id,
  });

  //get image url
  const dbImgUrl = await convexClient.query(api.images.getImage, {
    videoId,
    userId: user.id,
  });

  //Track the image generation event
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
    imageUrl: dbImgUrl,
  };
}
