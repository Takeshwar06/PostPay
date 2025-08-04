import React, { useEffect, useState } from "react";
import { Heart, Eye, Plus, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../../utils/axiosPrivate";

export default function UDashboard() {
  const user =
    useSelector((state) => state.auth.user) || localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/posts/" + user?._id);
      console.log(response.data);
      setPosts(response.data?.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    console.log("useris ", user);
    fetchPosts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6 border">
        {/* Buttons Group */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => navigate("/create-post")}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 text-sm rounded-full hover:bg-blue-700 transition-all"
          >
            <Plus size={16} />
            Post
          </button>
          <button
           onClick={() => navigate("/user/my-claims")}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 text-sm rounded-full hover:bg-green-700 transition-all"
          >
            Claims
            <ArrowRight size={16}/>
          </button>
        </div>

        {/* User Info */}
        <img
          src={user?.avatar || "https://i.pravatar.cc/150?img=7"}
          alt={user?.name}
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-600 text-sm">{user?.email}</p>
          <div className="flex flex-wrap gap-4 text-sm mt-3 justify-center sm:justify-start">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              Total Posts: {posts.length}
            </span>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
              Total Likes: {300}
            </span>
          </div>
        </div>
      </div>

      {/* Post Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden border"
          >
            {/* Header (user info) */}
            <div className="flex items-center p-4 gap-4">
              <img
                src={post?.owner?.avatar}
                alt={post?.owner?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-sm font-semibold">{post?.owner?.name}</h2>
                <p className="text-xs text-gray-500">{post?.owner?.email}</p>
              </div>
              <p className="bg-purple-100 text-sm text-purple-600 px-1 py-0  rounded-full">
                {post.isClaimed ? "Claimed" : "Not Claimed"}
              </p>
            </div>

            {/* Image */}
            <img
              src={post.image}
              alt="Post"
              className="w-full h-44 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-3">{post?.content}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{post?.likeCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>{post?.viewCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
