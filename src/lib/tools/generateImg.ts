import { tool } from "ai";
import { z } from "zod";
import { client } from "../schematic";
import { FeatureFlag } from "@/features/flags";
import { ImgGeneration } from "@/actions/ImgGeneration";


export const generateImg = (videoId: string, userId: string) =>
  tool({
    description: "Generate an Image",
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

      const image = await ImgGeneration(prompt, videoId);
      return { image };
    },
  });
