import { getYtTranscript } from "@/actions/getYtTranscript";
import { tool } from "ai";
import { z } from "zod";

export const fetchTranscript = tool({
  description: "Fetch the transcript of a YouTube video in segments",
  parameters: z.object({
    videoId: z.string().describe("The video ID to fetch the transcript for"),
  }),
  execute: async ({ videoId }) => {
    try {
      const transcript = await getYtTranscript(videoId);
      return {
        cache: transcript.cache,
        transcript: transcript.transcript,
      };
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return {
        error:
          "Failed to fetch the transcript. Please check the video ID and try again.",
      };
    }
  },
});
