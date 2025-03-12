import { getVideoChapters } from "@/actions/getVideoChapters";
import { tool } from "ai";
import { z } from "zod";

export const generateVideoChapters = tool({
  description: "Fetch the video chapters of a YouTube video in segments",
  parameters: z.object({
    videoId: z
      .string()
      .describe("The video ID to fetch the video chapters for"),
  }),
  execute: async ({ videoId }) => {
    try {
      const { cache, chapters } = await getVideoChapters(videoId);
      return {
        cache,
        chapters,
      };
    } catch (error) {
      console.error("Error fetching video chapters:", error);
      return {
        error:
          "Failed to fetch the video chapters. Please check the video ID and try again.",
      };
    }
  },
});
