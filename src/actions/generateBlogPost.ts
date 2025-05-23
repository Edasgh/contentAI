"use server";
import { VideoDetails } from "@/types/types";
import { getVideoDetails } from "./getVideoDetails";
import { generateVideoSummary } from "./titleGeneration";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  systemInstruction: `You are a helpful blog post creator assistant that creates a comprehensive, SEO-optimized blog post,a relevant title, relevant keywords & tags for the blog post based on the given youtube video's summary. `,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDetails(videoId: string) {
  try {
    //get video title & description
    const details: VideoDetails | null = await getVideoDetails(videoId);

    if (!details) {
      console.log("Failed to generate blog post (system error) ");
      return null;
    }

    //get video summary
    const { summary } = await generateVideoSummary(videoId);

    if (!summary) {
      console.log("Failed to generate blog post (system error) ");
      return null;
    }

    return {
      title: details.title,
      description: details.description,
      summary,
    };
  } catch (error) {
    console.log("Error generating blog post : ", error);
    return null;
  }
}

export async function generateBlogContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) throw new Error("Empty response from AI");

    return responseText;
  } catch (error) {
    console.error("Error generating Blog Content :", error);
    return null;
  }
}

export async function getBlogDetails(videoId: string) {
  try {
    //get the details
    const details = await getDetails(videoId);
    if (!details) {
      return null;
    }

    //getting tags
    const tagGenerationPrompt = `Generate ONLY 5 SEO-friendly tags for a blog post based on 
    The following youTube video details:\n\n
    Title:${details.title}\n\n, 
    Description:${details.description}\n\n, 
    Summary:${details.summary}\n\n. 
    The tags should be relevant to the topic, popular for search engines, and concise.

    Return the tags as a **comma-separated list**.
    `;
    const tags = await generateBlogContent(tagGenerationPrompt);

    if (!tags) {
      return null;
    }

    //getting keywords
    const keywordGenerationPrompt = `Generate ONLY 5 SEO-friendly keywords for a blog post based on 
    The following youTube videodetails:\n\n
    Title:${details.title}\n\n, 
    Description:${details.description}\n\n, 
    Summary:${details.summary}\n\n. 
    The keywords should be relevant to the topic, popular for search engines, and concise.

    Return the keywords as a **comma-separated list**.
    `;

    const keywords = await generateBlogContent(keywordGenerationPrompt);
    if (!keywords) {
      return null;
    }

    //getting blog title
    const titleGenerationPrompt = `Generate ONLY 1  high quality , SEO-friendly, concise blog title (and NOTHING else) for a blog post based on the following youTube videodetails:\n\n
    Title:${details.title}\n\n, 
    Description:${details.description}\n\n, 
    Summary:${details.summary}\n\n. 
    The title should be relevant to the topic, popular for search engines, and concise. Generate the title ONLY and NOTHING else.
    `;

    const titles = await generateBlogContent(titleGenerationPrompt);

    if (!titles) {
      return null;
    }
    return {
      summary: details.summary,
      tags: tags.split(",").filter((e) => e.trim() !== ""),
      keywords: keywords.split(",").filter((e) => e.trim() !== ""),
      blogTitle: titles.split("\n").filter((e) => e.trim() !== "")[0],
    };
  } catch (error) {
    console.log("Error generating blog post : ", error);
    return null;
  }
}

export async function generateBlogPost(videoId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        error: "Failed to generate blog post (system error) ",
      };
    }

    //get the details
    const details = await getBlogDetails(videoId);
    if (!details) {
      return {
        error: "Failed to generate blog post (system error) ",
      };
    }

    const chat = model.startChat({});
    //generating blog post
    const result = await chat.sendMessage(
    `Write ONLY ONE well-structured, engaging blog post content based on 
    the following YouTube video details:
    **Video Summary:** ${details.summary}\n\n

    And for the following blog details :\n\n
    **Blog Title** : ${details.blogTitle}\n\n
    **Tags** : ${details.tags.join(",")}\n\n
    **Keywords** : ${details.keywords.join(",")}\n\n

    The blog should:
    - Start with a compelling introduction
    - Extract key insights from the video summary
    - Structure content into well-defined sections
    - Include relevant takeaways and examples
    - Conclude with a call-to-action

    Maintain a natural, engaging, and informative tone.
    Generate the blog content ONLY, NOT anything else like, title or tags or keywords.`
    );

    const blogPost = result.response.text();
    if (!blogPost) {
      return {
        error: "Failed to generate blog post (system error) ",
      };
    }

    const generatedBlog = {
      title: details.blogTitle,
      tags: details.tags,
      keywords: details.keywords,
      content: blogPost,
    };

    // Store blog post in database
    await convex.mutation(api.blog.storeBlog, {
      videoId,
      userId: user.id,
      blogPost: generatedBlog,
    });

    return {
      tags: details.tags,
      keywords: details.keywords,
      blogTitle: details.blogTitle,
      blogPost,
    };
  } catch (error) {
    console.log("Error generating blog post : ", error);
    return {
      error: "Error occurred while generating blog post, try again",
    };
  }
}
