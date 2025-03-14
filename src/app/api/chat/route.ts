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
import { getAudienceAnalysis } from "@/lib/tools/getAudienceAnalysis";
import { generateVideoSummary } from "@/actions/titleGeneration";
import { generateShootingScript } from "@/actions/generateShootingScript";

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
  If any tool is used, analyse the response and if it contains a cache, explain that the transcript or the video chapters is cached because they previously transcribed the video saving the user a token - use words like database instead of cache to make it more easy to understand.  
  If the user asks to generate a thumbnail, generate only ONE Thumbnail.
  If the user asks any question, generate video summary and answer according to the summary only. 
  
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
      generateVideoChapters: generateVideoChapters,
      generateVideoSummary: tool({
        description: "Get the summary of a YouTube video",
        parameters: z.object({
          videoId: z.string().describe("The video ID to get the summary for"),
        }),
        execute: async ({ videoId }) => {
          const { summary } = await generateVideoSummary(videoId);
          return { summary };
        },
      }),
      getAudienceAnalysis: getAudienceAnalysis,
      generateThumbnail: generateImg(videoId, user?.id ?? ""),
      generateShootingScript: tool({
        description: "Get the shooting script for a video similar to this",
        parameters: z.object({
          videoId: z.string().describe("The video ID to get shooting script for"),
        }),
        execute: async ({ videoId }) => {
          try {
            const {shooting_script} = await generateShootingScript(videoId);
            return { shooting_script };
          } catch (error) {
            console.log("Error fetching shooting script",error);
            return {
              shooting_script: "",
              error:
                "Failed to fetch the shooting script. Please check the video ID and try again.",
            };
          }
        },
      }),
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
          videoId: z.string().describe("The video ID to get the comments of"),
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
