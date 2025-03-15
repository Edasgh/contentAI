import { generateBlogPost } from "@/actions/generateBlogPost";
import { tool } from "ai";
import { z } from "zod";

export const generateBlog = tool({
  description: "Generate a blog post based on a YouTube video",
  parameters: z.object({
    videoId: z.string().describe("The video ID to generate the blog post from"),
  }),
  execute: async ({ videoId }) => {
    try {
      const { tags, keywords, blogTitle, blogPost } =
        await generateBlogPost(videoId);
      return {
        tags,
        keywords,
        blogTitle,
        blogPost,
      };
    } catch (error) {
      console.error("Error fetching analysis:", error);
      return {
        error:
          "Failed to generate blog post. Please check the video ID and try again.",
      };
    }
  },
});
