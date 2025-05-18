import React from "react";

const CommentSkeleton = () => (
  <div className="flex items-center space-x-2 py-2 animate-pulse">
    <div className="bg-gray-300 rounded-full w-8 h-8" />
    <div className="flex-1">
      <div className="bg-gray-300 h-3 w-1/3 rounded mb-2" />
      <div className="bg-gray-300 h-4 w-3/4 rounded" />
    </div>
  </div>
);

export default CommentSkeleton;