import { generateSocialsPost } from "@/actions/generateSocialsPost";
import { tool } from "ai";
import { z } from "zod";

export const generatePost = tool({
  description: "Generate a social media post based on a YouTube video",
  parameters: z.object({
    prompt: z
      .string()
      .describe("The custom requirements for the post to fulfill"),
    postType: z.string().describe("The platform the post is for"),
    videoId: z
      .string()
      .describe("The video ID to generate the social media post from"),
  }),
  execute: async ({ videoId, postType, prompt }) => {
    try {
      const postDetails = await generateSocialsPost(prompt, postType, videoId);
      if (!postDetails) {
        return {
          error:
            "Failed to generate post. Please check the video ID and try again.",
        };
      }

      return {
        tags: postDetails.tags,
        keywords: postDetails.keywords,
        post: postDetails.post,
      };
    } catch (error) {
      console.error("Error generating post:", error);
      return {
        error:
          "Failed to generate post. Please check the video ID and try again.",
      };
    }
  },
});
