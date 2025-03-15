import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const storeBlog = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    blogPost: v.object({
      title: v.string(),
      tags: v.array(v.string()),
      keywords: v.array(v.string()),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const titleId = await ctx.db.insert("blog", {
      videoId: args.videoId,
      userId: args.userId,
      blogPost: args.blogPost,
    });

    return titleId;
  },
});

export const getBlogsByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blog")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const listBlogs = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blog")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();
  },
});

export const getBlogById = query({
  args: {
    id:v.id("blog")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
