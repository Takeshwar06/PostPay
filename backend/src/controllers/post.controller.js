import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import View from "../models/view.model.js";
import mongoose from "mongoose";

export const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user._id;

  console.log("userId", userId);
  if (!content) {
    return next(new ApiError(400, "Content are required"));
  }

  const contentExists = await Post.findOne({ content });
  if (contentExists) {
    return next(new ApiError(409, "Post with this content already exists"));
  }

  const postBuffer = req.file?.buffer;
  let imageUrl;
  if (!postBuffer) {
    return next(new ApiError(409, "post image is required"));
  }

  imageUrl = await uploadOnCloudinary(postBuffer);
  if (!imageUrl) {
    return next(new ApiError(400, "Error while uploading image"));
  }

  const post = new Post({
    content,
    owner: userId,
    image: imageUrl?.url,
  });

  await post.save();

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

export const getPosts = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;

    const pipeline = [];

    if (userId) {
      pipeline.push({
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      });
    }

    // Join user details
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      { $unwind: "$ownerDetails" }
    );

    // Join likes
    pipeline.push({
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    });

    // Join views
    pipeline.push({
      $lookup: {
        from: "views",
        localField: "_id",
        foreignField: "postId",
        as: "views",
      },
    });

    if (req.user?._id) {
      pipeline.push({
        $addFields: {
          isLikedByUser: {
            $in: [new mongoose.Types.ObjectId(req.user?._id), "$likes.userId"],
          },
          isViewedByUser: {
            $in: [new mongoose.Types.ObjectId(req.user?._id), "$views.userId"],
          },
        },
      });
    }

    // Project final result
    pipeline.push({
      $project: {
        _id: 1,
        content: 1,
        image: 1,
        createdAt: 1,
        updatedAt: 1,
        likeCount: { $size: "$likes" },
        viewCount: { $size: "$views" },
        isLikedByUser: 1,
        isViewedByUser: 1,
        owner: {
          _id: "$ownerDetails._id",
          name: "$ownerDetails.name",
          email: "$ownerDetails.email",
          avatar: "$ownerDetails.avatar",
        },
      },
    });

    pipeline.push({ $sort: { createdAt: -1 } });

    const posts = await Post.aggregate(pipeline);

    if (!posts || posts.length === 0) {
      return next(new ApiError(404, "No posts found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts fetched successfully"));
  } catch (error) {
    console.error("Error fetching posts:", error);
    next(new ApiError(500, "Failed to fetch posts", error));
  }
});


export const togglePostLike = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  if (!postId) {
    return next(new ApiError(400, "Post ID is required"));
  }

  const like = await Like.findOne({ postId, userId });
  if (like) {
    // If the post is already liked, remove the like
    await Like.findOneAndDelete({ postId, userId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post unliked successfully"));
  } else {
    // If the post is not liked, add a like
    const newLike = new Like({ postId, userId });
    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Post liked successfully"));
  }
});

export const addViewToPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  if (!postId) {
    return next(new ApiError(400, "Post ID is required"));
  }

  const view = await View.findOne({ postId, userId });
  if (view) {
    // If the post is already viewed, return a message
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post already viewed"));
  } else {
    // If the post is not viewed, add a view
    const newView = new View({ postId, userId });
    await newView.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newView, "Post view added successfully"));
  }
});
