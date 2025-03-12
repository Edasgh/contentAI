"use server";

import { currentUser } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface Comments {
  comments: string[];
  cache: string;
}

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getVideoComments(
  videoId: string
): Promise<Comments | null> {
  const commentsArr: string[] = [];

  const user = await currentUser();

  // TODO :  Check if comments already exists in db [iF IT'S cached]
  const existingComments = await convex.query(
    api.comments.getCommentsByVideoId,
    { videoId, userId: user?.id ?? "" }
  );

  if (existingComments) {
    console.log("Comment found in db");
    return {
      comments: existingComments.comments,
      cache:
        "This video's comments have already been fetched - Accessing cached comments instead of using a token",
    };
  }

  try {
    // Fetch video comments
    const commentsResponse = await youtube.commentThreads.list({
      part: ["snippet", "replies"],
      videoId,
      maxResults: 20,
    });

    // Check if there are comments
    if (commentsResponse.data.items) {
      commentsResponse.data.items.forEach((item) => {
        const topComment = item.snippet?.topLevelComment?.snippet?.textDisplay;
        if (topComment) commentsArr.push(topComment);
      });
    }

    // Store transcript in database
    await convex.mutation(api.comments.storeComments, {
      videoId,
      userId: user?.id ?? "",
      comments: commentsArr,
    });

    return {
      comments: commentsArr,
      cache:
        "This video's comments were fetched using a token, the comments are now saved in database",
    };
  } catch (error) {
    console.error("Error fetching video comments:", error);
    return null;
  }
}
