import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import axiosPrivate from "../utils/axiosPrivate";


export default function Home() {
  const [posts,setPosts] = useState([]);
    const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/v1/posts");
      console.log(response.data);
      setPosts(response.data?.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post}/>
      ))}
    </div>
  );
}
