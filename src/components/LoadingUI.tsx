"use client";

export default function LoadingUI() {
  return (
    <main className="w-full h-screen relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
      <div className="loading-container">
        <div className="loader"></div>
        <div className="loader"></div>
        <div className="loader"></div>
      </div>
    </main>
  );
}
