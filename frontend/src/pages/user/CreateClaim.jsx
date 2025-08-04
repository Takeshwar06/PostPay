import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosPrivate from "../../utils/axiosPrivate";

export default function CreateClaim() {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [screenshots, setScreenshots] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/posts?isClaimed=false");
      console.log(response.data);
      setPosts(response.data?.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const handleScreenshotChange = (e, postId) => {
    const file = e.target.files[0];
    setScreenshots((prev) => ({ ...prev, [postId]: file }));
  };

  const handleSelectPost = (postId) => {
    if (!screenshots[postId]) {
      alert("Please upload screenshot first.");
      return;
    }
    if (!selectedPosts.includes(postId)) {
      setSelectedPosts((prev) => [...prev, postId]);
    } else {
      setSelectedPosts((prev) => prev.filter((id) => id !== postId));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    selectedPosts.forEach((postId, index) => {
      const post = posts.find((p) => p._id === postId);
      formData.append(`posts[${index}][post]`, postId);
      formData.append(`posts[${index}][likes]`, post.likeCount);
      formData.append(`posts[${index}][views]`, post.viewCount);
      formData.append(`posts[${index}][screenshot]`, screenshots[postId]);
    });

    try {
      const res = await axiosPrivate.post("/api/v1/claims", formData);
      console.log(res);
      setPosts((prev) => prev.filter((post) => !selectedPosts.includes(post._id)));
      setSelectedPosts([]);
      setScreenshots({});
    } catch (error) {
      console.error(error);
      alert("Error submitting claim");
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Claim</h2>
      
      {posts.length === 0 &&(<p>You have't post to claim please create post</p>)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts
          .filter((p) => !p.isClaim)
          .map((post) => (
            <div
              key={post._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <img
                src={post.image}
                alt="post"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <p className="text-sm mb-2">{post.content}</p>
              <p className="text-xs text-gray-500 mb-2">
                Likes: {post.likeCount}, Views: {post.viewCount}
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleScreenshotChange(e, post._id)}
                className="mb-3 text-sm"
              />

              <button
                onClick={() => handleSelectPost(post._id)}
                className={`w-full py-2 rounded font-medium text-white ${
                  selectedPosts.includes(post._id)
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {selectedPosts.includes(post._id) ? "Deselect" : "Select"} Post
              </button>
            </div>
          ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={selectedPosts.length === 0 || loading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
         {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
