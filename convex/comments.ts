import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getCommentsByVideoId = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();
  },
});

export const storeComments = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    comments: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // check if the transcript already exists
    const existingComments = await ctx.db
      .query("comments")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();

    // return that
    if (existingComments) {
      return existingComments;
    }

    //create new transcript
    return await ctx.db.insert("comments", {
      videoId: args.videoId,
      userId: args.userId,
      comments: args.comments,
    });
  },
});

export const getCommentsByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
