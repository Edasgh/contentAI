"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { PenToolIcon } from "lucide-react";

export default function AllMyBlogs() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  const blogs = useQuery(api.blog.getBlogsByUserId, {
    userId: user.id,
  }); // PUll from convex db

  return (
    <>
      {" "}
      {blogs &&
        blogs.length !== 0 &&
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="group mt-3 relative py-5 px-4 rounded-lg border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
          >
            <Link
              href={`/analysis/blog/${blog._id}`}
              className="flex items-center justify-between gap-2"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                {" "}
                {blog.blogPost.title}
              </p>

              <div className="border-[1px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-6 rounded-xl">
                <PenToolIcon />
              </div>
            </Link>
          </div>
        ))}
      {/* No blogs generated yet */}
      {!blogs?.length && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No Blogs have been generated yet</p>{" "}
        </div>
      )}
    </>
  );
}
