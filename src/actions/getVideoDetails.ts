"use server";

import { google } from "googleapis";
import { VideoDetails } from "@/types/types";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getVideoDetails(videoId: string):Promise<VideoDetails | null>{
  // console.log("Fetching video details for ",videoId);

  try {
    //get video details
    const videoResponse = await youtube.videos.list({
      part: ["statistics", "snippet"],
      id: [videoId],
    });
    // console.log(videoResponse);
    const videoDetails = videoResponse.data.items?.[0];
    if (!videoDetails) throw new Error("Video not found!");

    // Get channel details including thumbnail
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "statistics"],
      id: [videoDetails.snippet?.channelId || ""],
      key: process.env.YOUTUBE_API_KEY,
    });

    const channelDetails = channelResponse.data.items?.[0];

    console.log("video details fetched successfully!");

    const video: VideoDetails = {
      // Video Info
      title: videoDetails.snippet?.title || "Unknown Title",
      description:videoDetails.snippet?.description || "Unknown Description",
      thumbnail:
        videoDetails.snippet?.thumbnails?.maxres?.url ||
        videoDetails.snippet?.thumbnails?.high?.url ||
        videoDetails.snippet?.thumbnails?.default?.url ||
        "",

      publishedAt:
        videoDetails.snippet?.publishedAt || new Date().toISOString(),

      // Video Metrics
      views: videoDetails.statistics?.viewCount || "0",
      likes: videoDetails.statistics?.likeCount || "Not Available",
      comments: videoDetails.statistics?.commentCount || "Not Available",
      // Channel Info
      channel: {
        title: videoDetails.snippet?.channelTitle || "Unknown Channel",
        thumbnail: channelDetails?.snippet?.thumbnails?.default?.url || "",
        subscribers: channelDetails?.statistics?.subscriberCount || "0",
      },
    };
    // console.log("The video", video);
    return video;
  } catch (error) {
    console.error("Error fetching details", error);
    return null;
  }
}
