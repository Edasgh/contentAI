import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Query to get all videos for a user
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("videos")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// get video by id
export const getVideoById = query({
  args: { videoId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();
  },
});


export const createVideoEntry = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    title:v.string()
  },
  handler: async (ctx, args) => {
    const videoId = await ctx.db.insert("videos", {
      videoId: args.videoId,
      userId: args.userId,
      title:args.title
    });
    return videoId;
  },
});
