"use client";

export default function BlogPostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>

      {/* Tags Skeleton */}
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        <div className="h-6 bg-gray-300 rounded-full w-24"></div>
        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
      </div>

      {/* Keywords Skeleton */}
      <div className="flex space-x-2 mb-6">
        <div className="h-6 bg-gray-300 rounded-full w-28"></div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>

      {/* Blog Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
}
