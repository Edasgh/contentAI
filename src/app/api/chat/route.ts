import { streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { fetchTranscript } from "@/lib/tools/fetchTranscript";
import { generateImg } from "@/lib/tools/generateImg";
import { z } from "zod";
import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import generateTitle from "@/lib/tools/generateTitle";
import { NextResponse } from "next/server";
import { getVideoComments } from "@/actions/getVideoComments";
import { generateVideoChapters } from "@/lib/tools/generateVideoChapters";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const google = createGoogleGenerativeAI({
  // custom settings
  apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
});

const model = google("gemini-2.0-flash-001");

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  const videoDetails = await getVideoDetails(videoId);

  const SYSTEM_MESSAGE = `You are an AI assistant for analyzing a single video. The video ID is ${videoId} but you'll refer to this as ${videoDetails?.title || "Selected Video"}. Respond naturally in human-like language and make the conversation engaging with emojis.
  If an error occurs, explain it to the user and ask them to try again later. If the error suggest the user upgrade, explain that they must upgrade to use this feature, tell them to go to 'Manage Plan' in the header and upgrade. 
  If any tool is used, analyse the response and if it contains a cache, explain that the transcript is cached because they previously transcribed the video saving the user a token - use words like database instead of cache to make it more easy to understand. 
  If the user asks to generate a title, generate transcripts first and then summarize the transcripts and pass the summary to "generateTitle" tool to generate ONLY ONE title. 
  If the user asks to generate a thumbnail, generate only ONE Thumbnail.
  If the user asks about the video, generate transcripts first and then summarize the transcripts and send user the summary. 
  If the user asks to generate video chapters, call the 'generateVideoChapters' tool passing the ${videoId} and send the time based chapters.
  If the user asks about the target audience and overall sentiment of the video, first, fetch the video details to determine the primary target audience and then, fetch the comments from the video and perform a sentiment analysis to assess the overall tone of audience reactions. Categorize the sentiment into positive, neutral, and negative percentages. Finally, provide a detailed, insightful breakdown of both the target audience analysis and the overall sentiment analysis of the video.

  Format for notion.`;

  const result = streamText({
    model,
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGE,
      },
      ...messages,
    ],
    tools: {
      fetchTranscript: fetchTranscript,
      generateTitle: generateTitle,
      generateVideoChapters:generateVideoChapters,
      generateThumbnail: generateImg(videoId, user?.id ?? ""),
      getVideoDetails: tool({
        description: "Get the details of a YouTube video",
        parameters: z.object({
          videoId: z.string().describe("The video ID to get the details for"),
        }),
        execute: async ({ videoId }) => {
          const videoDetails = await getVideoDetails(videoId);
          return { videoDetails };
        },
      }),
      getVideoId: tool({
        description: "Extract the video ID from a URL",
        parameters: z.object({
          url: z.string().describe("The URL to extract the video ID from"),
        }),
        execute: async ({ url }) => {
          const videoId = await getVideoIdFromUrl(url);
          return { videoId };
        },
      }),
      getVideoComments: tool({
        description: "Get the comments of a YouTube video",
        parameters: z.object({
          videoId: z.string().describe("The video ID to get the details for"),
        }),
        execute: async ({ videoId }) => {
          const videoComments = await getVideoComments(videoId);
          return { videoComments };
        },
      }),
    },
  });

  // console.log(
  //   "GEMINI RESULT MESSAGES FROM CHAT ROUTE :\n",
  //   (await result.response).messages
  // );
  // console.log(messages, videoId);
  return result.toDataStreamResponse();
}
