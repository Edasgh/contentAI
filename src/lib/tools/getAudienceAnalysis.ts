import { analyseAudience } from "@/actions/analyseVideoAudience";
import { tool } from "ai";
import { z } from "zod";

export const getAudienceAnalysis = tool({
  description: "Get the audience analysis of a YouTube video",
  parameters: z.object({
    videoId: z.string().describe("The video ID to get the audience analysis for"),
  }),
  execute: async ({ videoId }) => {
    try {
      const analysis = await analyseAudience(videoId);
      return {
        cache: analysis.cache,
        analysis: analysis.analysis,
      };
    } catch (error) {
      console.error("Error fetching analysis:", error);
      return {
        error:
          "Failed to analyse audience. Please check the video ID and try again.",
      };
    }
  },
});
