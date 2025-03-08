"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center animate-fadeIn">
        <img
          src="https://yemca-services.net/404.png"
          alt="404 Illustration"
          className="mx-auto w-80 animate-[float_3s_infinite]"
        />
        <h1 className="text-7xl font-extrabold text-blue-700 dark:text-blue-400/80 mt-6">
          Looks Like You're Lost!
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-500 mt-2">
          We can't seem to find the page you're looking for.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform transition hover:scale-105 hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
