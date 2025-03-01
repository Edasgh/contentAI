import { tool } from "ai";
import { z } from "zod";
import { titleGeneration } from "@/actions/titleGeneration";

const generateTitle = tool({
  description: "Generate a title for this video.",
  parameters: z.object({
    videoId: z.string().describe("The Video ID to generate a title for"),
    videoSummary: z
      .string()
      .describe("The summary of the video to generate a title for"),
    considerations: z
      .string()
      .describe("Any additional considerations for the title"),
  }),

   execute: async ({ videoId , videoSummary,considerations}) => {
      try {
        const title = await titleGeneration(videoId,videoSummary,considerations);
        return {title};
      } catch (error) {
        console.error("Error fetching transcript:", error);
        return {
          error:
            "Failed to fetch the transcript. Please check the video ID and try again.",
        };
      }
    },
});


export default generateTitle;