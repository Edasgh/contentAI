"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

export default function AllMyPosts() {
  const { user } = useUser();

  const posts = useQuery(api.post.getPostsByUserId, {
    userId: user?.id ?? "",
  }); // PUll from convex db

  if (!user) {
    return (
      <div className="text-red-500 text-center py-4">
        Something Went Wrong!....
      </div>
    );
  }

  return (
    <>
      {" "}
      {posts &&
        posts.length !== 0 &&
        posts.map((post) => (
          <div
            key={post._id}
            className="group mt-3 relative py-5 px-4 rounded-lg border border-gray-100 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
          >
            <Link
              href={`/analysis/post/${post._id}`}
              className="flex items-center justify-between gap-2"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                {" "}
                {post.postContent.content.slice(0, 100)}
              </p>
              {post.postType.toUpperCase() === "LINKEDIN" ? (
                <div
                  title={post.postType}
                  className="border-[1px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-6 rounded-xl"
                >
                  <LinkedinIcon />
                </div>
              ) : post.postType.toUpperCase() === "X(TWITTER)" ? (
                <div
                  title={post.postType}
                  className="border-[1px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-6 rounded-xl"
                >
                  <TwitterIcon />
                </div>
              ) : post.postType.toUpperCase() === "FACEBOOK" ? (
                <div
                  title={post.postType}
                  className="border-[1px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-6 rounded-xl"
                >
                  <FacebookIcon />
                </div>
              ) : (
                post.postType.toUpperCase() === "INSTAGRAM" && (
                  <div
                    title={post.postType}
                    className="border-[1px] border-blue-700 bg-blue-200 dark:bg-blue-400  p-6 rounded-xl"
                  >
                    <InstagramIcon />
                  </div>
                )
              )}
            </Link>
          </div>
        ))}
      {/* No posts generated yet */}
      {!posts?.length && (
        <div className="text-center py-8 px-4 rounded-lg mt-4 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No posts have been generated yet</p>{" "}
        </div>
      )}
    </>
  );
}
