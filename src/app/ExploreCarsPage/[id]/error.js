"use client";

import React, { useEffect } from "react";

export default function Error({ error }) {
  useEffect(() => {
    //console.error("Caught app runtime exception:", error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto my-20 px-6 text-center flex flex-col items-center justify-center gap-4 min-h-96">
      <h2 className="text-7xl font-bold my-10 text-red-600">
        Something went wrong!
      </h2>
      <p className="text-gray-500 mb-5 text-sm">
        {"An unexpected application error occurred."}
      </p>

      <div className="flex gap-4 mt-2">
        <button
          onClick={() => (window.location.href = "/")}
          className="h-10 px-5 text-sm font-semibold text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-colors"
        >
          Go Home
        </button>

        <button
          onClick={() => window.location.reload()}
          className="h-10 px-5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
