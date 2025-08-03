import React, { useState } from "react";
import { Heart, Eye, Loader } from "lucide-react";
import axiosPrivate from "../utils/axiosPrivate";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PostCard({ post }) {
  const [likeLoading, setLikeLoading] = useState(false);
  const [viewed, setViewed] = useState(post?.isViewedByUser);

  const toggleLike = async () => {
    try {
      setLikeLoading(true);
      const response = await axiosPrivate.patch(
        `/api/v1/posts/toggle-like/${post._id}`
      );
      post.isLikedByUser = !post.isLikedByUser;
      toast.success("Post Liked");
    } catch (error) {
      const { message } = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleView = async () => {
    try {
      const response = await axiosPrivate.patch(
        `/api/v1/posts/add-view/${post._id}`
      );
      setViewed(true);
    } catch (error) {
      const { message } = getErrorMessage(error);
      console.log(error);
    }
  };

  return (
    <div
      key={post._id}
      className="bg-white rounded-2xl shadow-md overflow-hidden border"
    >
      {/* User Info */}
      <div className="flex items-center p-4 gap-4">
        <img
          src={post?.owner?.avatar}
          alt={post?.owner?.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-md font-semibold">{post?.owner?.name}</h2>
          <p className="text-xs text-gray-500">{post?.owner?.email}</p>
        </div>
      </div>

      {/* Post Image with Overlay */}
      <div className="relative cursor-pointer">
        <img src={post.image} alt="Post" className="w-full h-48 object-cover" />

        {!viewed && (
          <div
            onClick={handleView}
            className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-sm font-medium backdrop-blur-sm"
          >
            <span>Tap to view</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-3">{post.content}</p>

        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLike}
              className="w-8 h-8 flex items-center justify-center rounded-full shadow-md bg-white hover:shadow-lg transition duration-200"
            >
              {likeLoading ? (
                <Loader className="w-4 h-4 text-red-500 animate-spin" />
              ) : (
                <FaHeart
                  className={`text-lg ${
                    post?.isLikedByUser ? "text-red-500" : "text-gray-400"
                  }`}
                />
              )}
            </button>
            <span>{post.likeCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span>{post.viewCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
