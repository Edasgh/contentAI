import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("audience_analysis")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();
  },
});

export const generate = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    analysis: v.string(),
  },
  handler: async (ctx, args) => {
    const existingAnalysis = await ctx.db
      .query("audience_analysis")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();

    // return that
    if (existingAnalysis) {
      return existingAnalysis;
    }
    const analysisId = await ctx.db.insert("audience_analysis", {
      videoId: args.videoId,
      userId: args.userId,
      analysis: args.analysis,
    });

    return analysisId;
  },
});
