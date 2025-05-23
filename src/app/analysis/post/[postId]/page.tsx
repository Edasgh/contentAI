"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import BlogPostSkeleton from "@/components/BlogPostSkeleton";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import { toast } from "react-toastify";

export default function SocialsPost() {
  const params = useParams<{ postId: string }>();
  const { postId } = params;

  const post = useQuery(api.post.getPostById, {
    id: postId as Id<"post">,
  });

  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  const postContent = post?.postContent;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <section>
      {post && postContent && (
        <div className="max-w-3xl mx-auto p-6 border rounded-md bg-gray-50 dark:bg-gray-300 relative">
          {post.postType.toUpperCase() === "LINKEDIN" ? (
            <div
              title={post.postType}
              className="border-[1px] absolute top-[-25px] left-[-20px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-3 rounded-xl"
            >
              <LinkedinIcon />
            </div>
          ) : post.postType.toUpperCase() === "X(TWITTER)" ? (
            <div
              title={post.postType}
              className="border-[1px] absolute top-[-25px] left-[-20px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-3 rounded-xl"
            >
              <TwitterIcon />
            </div>
          ) : post.postType.toUpperCase() === "FACEBOOK" ? (
            <div
              title={post.postType}
              className="border-[1px] absolute top-[-25px] left-[-20px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-3 rounded-xl"
            >
              <FacebookIcon />
            </div>
          ) : (
            post.postType.toUpperCase() === "INSTAGRAM" && (
              <div
                title={post.postType}
                className="border-[1px] absolute top-[-25px] left-[-20px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-3 rounded-xl"
              >
                <InstagramIcon />
              </div>
            )
          )}
          <div className="flex flex-col gap-3 justify-start items-start mb-4 pb-4 border-b">
            {/* Post Content */}
            <article className="pt-4 prose prose-lg text-gray-700 ">
              <ReactMarkdown>{postContent.content}</ReactMarkdown>
            </article>
            <div className="flex gap-3 justify-start items-start">
              <button
                onClick={() => copyToClipboard(postContent.content)}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600  cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600  cursor-pointer" /> Copy
                Content
              </button>
            </div>
          </div>

          <div className="flex gap-4 pb-8">
            {/* Tags */}
            <div className="flex flex-col justify-start items-start gap-4 pr-4">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-black">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {postContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(postContent.tags.join(","))}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600  cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600 cursor-pointer" /> Copy
                Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {!post && <BlogPostSkeleton />}
    </section>
  );
}
