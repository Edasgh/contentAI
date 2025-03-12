import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getChaptersByVideoId = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videoChapters")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();
  },
});

export const storeChapter = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    chapter: v.array(
      v.object({
        time: v.string(),
        title: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // check if the chapter already exists
    const existingChapter = await ctx.db
      .query("videoChapters")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();

    // return that
    if (existingChapter) {
      return existingChapter;
    }

    //create new chapter
    return await ctx.db.insert("videoChapters", {
      videoId: args.videoId,
      userId: args.userId,
      chapter:args.chapter
    });
  },
});


export const getChaptersByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videoChapters")
      .withIndex("by_user_id", (q) =>
        q.eq("userId", args.userId)
      )
      .collect();
  },
});
