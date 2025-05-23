import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  videos: defineTable({
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  transcript: defineTable({
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        text: v.string(),
        timestamp: v.string(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  images: defineTable({
    storageId: v.id("_storage"),
    userId: v.string(),
    videoId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  titles: defineTable({
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
  audience_analysis: defineTable({
    videoId: v.string(),
    userId: v.string(),
    analysis: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
  comments: defineTable({
    videoId: v.string(),
    userId: v.string(),
    comments: v.array(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
  videoChapters: defineTable({
    videoId: v.string(),
    userId: v.string(),
    chapter: v.array(
      v.object({
        time: v.string(),
        title: v.string(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  blog: defineTable({
    videoId: v.string(),
    userId: v.string(),
    blogPost: v.object({
      title: v.string(),
      tags: v.array(v.string()),
      keywords: v.array(v.string()),
      content: v.string(),
    }),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
  post: defineTable({
    videoId: v.string(),
    userId: v.string(),
    postType:v.string(),
    postContent: v.object({
      tags: v.array(v.string()),
      content: v.string(),
    }),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
});
