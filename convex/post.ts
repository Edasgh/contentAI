import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const storePost = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    postType: v.string(),
    postContent: v.object({
      tags: v.array(v.string()),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("post", {
      videoId: args.videoId,
      userId: args.userId,
      postContent: args.postContent,
      postType: args.postType,
    });

    return postId;
  },
});

export const getPostsByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("post")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const listPosts = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("post")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();
  },
});

export const getPostById = query({
  args: {
    id: v.id("post"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
