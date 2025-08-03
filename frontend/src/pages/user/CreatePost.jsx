import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import axiosPrivate from "../../utils/axiosPrivate";

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState(null); // For showing image
  const [imageFile, setImageFile] = useState(null); // For uploading
  const [content, setContent] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show preview
      setImageFile(file); // Save actual file to upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageFile); // Now imageFile is defined
    formData.append("content", content);

    try {
      const res = await axiosPrivate.post("/api/v1/posts", formData);

      console.log("Post created:", res.data);
      setContent("");
      setImagePreview(null);
      setImageFile(null);
    } catch (err) {
      console.error("Failed to create post:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <PlusCircle className="text-blue-600" />
        Create a New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full h-60 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
            disabled={!imageFile || !content.trim()}
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
