"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export default function BlogGeneration({ videoId }: { videoId: string }) {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  if (!videoId) {
    return <div className="text-gray-500 text-center py-4">Loading....</div>;
  }

  const blogs = useQuery(api.blog.listBlogs, {
    userId: user.id,
    videoId: videoId,
  }); // PUll from convex db

  return (
    <div className="flex flex-col dark:border-gray-600 shadow-md rounded-xl p-4 border">
      <div>
        <div className="flex justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Blog Generations
          </h2>
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">{blogs?.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto">
        {" "}
        {blogs && blogs.length!==0 &&
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="group relative p-4 rounded-lg border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <Link href={`/analysis/blog/${blog._id}`} className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {" "}
                  {blog.blogPost.title}
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* No blogs generated yet */}

      {!blogs?.length && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No Blogs have been generated yet</p>{" "}
        </div>
      )}
    </div>
  );
}
