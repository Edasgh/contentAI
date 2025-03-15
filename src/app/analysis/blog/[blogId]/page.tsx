"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import BlogPostSkeleton from "@/components/BlogPostSkeleton";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

export default function BlogPost() {
  const params = useParams<{ blogId: string }>();
  const { blogId } = params;

  const blog = useQuery(api.blog.getBlogById, {
    id: blogId as Id<"blog">,
  });

  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  const blogPost = blog?.blogPost;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <section>
      {blog && blogPost && (
        <div className="max-w-3xl mx-auto p-6 border rounded-md bg-gray-50 dark:bg-gray-300">
          {/* Title */}
          <div className="flex flex-col gap-3 justify-start items-start mb-4 pb-4 border-b">
            <h1 className="text-3xl font-bold text-gray-900">
              {blogPost.title}
            </h1>
            <div className="flex gap-3 justify-start items-start">
              <button
                onClick={() => copyToClipboard(blogPost.title)}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600 cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600 cursor-pointer" /> Copy
                Title
              </button>
              <button
                onClick={() => copyToClipboard(blogPost.content)}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600  cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600  cursor-pointer" /> Copy
                Content
              </button>
            </div>
          </div>

          <div className="flex gap-4 pb-8 border-b">
            {/* Tags */}
            <div className="flex flex-col justify-start items-start gap-4 pr-4 border-r">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-black">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(blogPost.tags.join(","))}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600  cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600 cursor-pointer" /> Copy
                Tags
              </button>
            </div>

            {/* Keywords */}
            <div className="flex flex-col gap-4 justify-start items-start">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-black">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {blogPost.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(blogPost.keywords.join(","))}
                className="p-1.5 hover:bg-blue-100 text-sm text-black rounded-md flex gap-2 items-center border border-blue-300 dark:border-blue-600  cursor-pointer"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-blue-600 cursor-pointer" /> Copy
                Keywords
              </button>
            </div>
          </div>

          {/* Blog Content */}
          <article className="pt-4 prose prose-lg text-gray-700 ">
            <ReactMarkdown>{blogPost.content}</ReactMarkdown>
          </article>
        </div>
      )}

      {!blog && <BlogPostSkeleton />}
    </section>
  );
}
