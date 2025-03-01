import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getImages = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();

    const imgUrls = await Promise.all(
      images.map(async (image) => {
        return {
          ...image,
          url: await ctx.storage.getUrl(image.storageId),
        };
      })
    );
  },
});

// generate the upload url of image
export const generateuploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// store image in db
export const storeImg = mutation({
  args: {
    storageId: v.id("_storage"),
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const imageId = await ctx.db.insert("images", {
      storageId: args.storageId,
      videoId: args.videoId,
      userId: args.userId,
    });

    return imageId;
  },
});

export const getImage = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db
      .query("images")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .first()
     
      if(!image){
        return null;
      }

      return await ctx.storage.getUrl(image.storageId);
    
  },
});