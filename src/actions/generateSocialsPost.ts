"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { getDetails } from "./generateBlogPost";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction: `You are a social media post creator assistant helping users write their posts for platforms like : LinkedIn, Twitter, Facebook & Instagram, based on their requirements.Also generate relevant keywords & tags for the post based on the given youtube video's summary and some custom post details (keywords, tags, custom requirements).`,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function customPrompts({
  postType,
  videoId,
}: {
  postType: string;
  videoId: string;
}) {
  try {
    const details = await getDetails(videoId);
    if (!details) {
      return null;
    }

    //getting tags
    const tagGenerationPrompt = `Generate ONLY 5 SEO-friendly tags for a ${postType} post based on 
    The following youTube video details:\n\n
    Title:${details.title}\n\n, 
    Description:${details.description}\n\n, 
    Summary:${details.summary}\n\n. 
    The tags should be relevant to the topic, popular for search engines, and concise.

    Return the tags as a **comma-separated list**.
    `;
    //getting keywords
    const keywordGenerationPrompt = `Generate ONLY 5 SEO-friendly keywords for a ${postType} post based on 
    The following youTube video details:\n\n
    Title:${details.title}\n\n, 
    Description:${details.description}\n\n, 
    Summary:${details.summary}\n\n. 
    The keywords should be relevant to the topic, popular for search engines, and concise.

    Return the keywords as a **comma-separated list**.
    `;
    return {
      tagGenerationPrompt,
      keywordGenerationPrompt,
    };
  } catch (error) {
    return null;
  }
}

export async function generatePostContent(prompt: string) {
  try {
    const chat = model.startChat({});
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    if (!responseText) throw new Error("Empty response from AI");

    return responseText;
  } catch (error) {
    console.error("Error generating Post Content :", error);
    return null;
  }
}

export async function generateSocialsPost(
  prompt: string,
  postType: string,
  videoId: string
) {
  try {
    const details = await customPrompts({ postType, videoId });
    if (!details) {
      return null;
    }

    const tags = await generatePostContent(details.tagGenerationPrompt);
    if (!tags) {
      return {
        error: "Failed to generate post (system error) ",
      };
    }
    const keywords = await generatePostContent(details.keywordGenerationPrompt);
    if (!keywords) {
      return {
        error: "Failed to generate post (system error) ",
      };
    }
    const postgenerationPrompt = `Create an engaging ${postType} post using the following content.
        Content:\n
        ${prompt}
        Use the following keywords: ${keywords}\n
        Include these hashtags where appropriate: ${tags}\n
        The ${postType} post should match the tone of the platform.`;

    const socialPost = await generatePostContent(postgenerationPrompt);
    if (!socialPost) {
      return {
        error: "Failed to generate post (system error) ",
      };
    }

    return {
      tags: tags.split(","),
      keywords: keywords.split(","),
      post: socialPost,
    };
  } catch (error) {
    console.log("Error generating post : ", error);
    return {
      error: "Error occurred while generating post, try again",
    };
  }
}
