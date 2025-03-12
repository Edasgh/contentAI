import { tool } from "ai";
import { z } from "zod";
import { client } from "../schematic";
import { FeatureFlag } from "@/features/flags";
import { ImgGeneration } from "@/actions/ImgGeneration";
import { dalleImageGeneration } from "@/actions/ImgGenerationWithFlux";

export const generateImg = (videoId: string, userId: string) =>
  tool({
    description: "Generate an Image (Thumbnail of an YouTube video)",
    parameters: z.object({
      prompt: z.string().describe("The prompt to generate an image for"),
      videoId: z.string().describe("The Youtube video ID"),
    }),
    execute: async ({ prompt }) => {
      const schematicCtx = {
        company: {
          id: userId,
        },
        user: {
          id: userId,
        },
      };

      const isImgGenEnabled = await client.checkFlag(
        schematicCtx,
        FeatureFlag.IMG_GENERATION
      );

      if (!isImgGenEnabled) {
        return {
          error: "Image generation isn't enabled. The user must upgrade",
        };
      }

      // const image = await dalleImageGeneration(prompt, videoId);
      const image = await ImgGeneration(prompt, videoId);
      return { image };
    },
  });
