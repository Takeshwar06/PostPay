import Claim from "../models/claim.model.js";
import ReviewHistory from "../models/reviewHistory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import getAmountPerLikeView from "../utils/getAmountPerLikeView.js";

export const createClaim = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const { posts: rawPosts } = req.body;

  if (!rawPosts) {
    return next(new ApiError(400, "Posts are required"));
  }

  const postsData = Array.isArray(rawPosts) ? rawPosts : [rawPosts];

  const finalPosts = [];

  let totalLikes = 0;
  let totalViews = 0;

  for (let i = 0; i < postsData.length; i++) {
    const postData = postsData[i];
    const postId = postData.post;
    const likes = Number(postData.likes || 0);
    const views = Number(postData.views || 0);

    if (!postId || isNaN(likes) || isNaN(views)) {
      return next(new ApiError(400, `Invalid data for post at index ${i}`));
    }

    const fileKey = `posts[${i}][screenshot]`;
    const fileArray = req.files?.[fileKey];
    if (!fileArray || fileArray.length === 0) {
      return next(new ApiError(400, `Screenshot missing for post index ${i}`));
    }

    const screenshotBuffer = fileArray[0].buffer;
    const screenshotUrl = await uploadOnCloudinary(screenshotBuffer);
    if (!screenshotUrl) {
      return next(
        new ApiError(400, `Error uploading screenshot for post index ${i}`)
      );
    }

    finalPosts.push({
      post: postId,
      likes,
      views,
      screenshot: screenshotUrl,
    });

    totalLikes += likes;
    totalViews += views;
  }

  const { perLike, perView } = getAmountPerLikeView(totalLikes, totalViews);
  const finalAmount = totalLikes * perLike + totalViews * perView;

  const claim = await Claim.create({
    user: userId,
    posts: finalPosts,
    totalLikes,
    totalViews,
    requestedAmount: finalAmount,
    finalAmount,
    status: "pending",
    stage: "account",
  });

  // add review history for the claim
  const reviewHistory = new ReviewHistory({
    claim: claim._id,
    actedBy: userId,
    role: "User",
    action: "claim_submitted",
    message: "Claim submitted by user",
    totalAmtNow: finalAmount,
  });

  await reviewHistory.save();
  claim.reviewHistory.push(reviewHistory._id);
  await claim.save();
  res
    .status(201)
    .json(new ApiResponse(201, claim, "Claim submitted successfully"));
});

export const getClaims = asyncHandler(async (req, res, next) => {
  const claims = await Claim.find()
    .populate({
      path: "user",
      select: "name email phone",
    })
    .populate({
      path: "posts.post",
      select: "content image",
    })
    .populate({
      path: "reviewHistory",
      populate: {
        path: "actedBy",
        select: "name phone",
      },
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, claims, "Claims fetched successfully"));
});

export const getClaimsByUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const claims = await Claim.find({ user: userId })
    .populate({
      path: "posts.post",
      select: "content image",
    })
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, claims, "Claims fetched successfully"));
});

// account team actions on claims
export const accountTeamAction = asyncHandler(async (req, res, next) => {
  const { action, message, deductionAmt } = req.body;
  const { claimId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  if (userRole !== "Account") {
    return next(
      new ApiError(403, "Access denied: Account team privileges required")
    );
  }

  if (!claimId || !action) {
    return next(new ApiError(400, "Claim ID and action are required"));
  }
  const claim = await Claim.findById(claimId);
  if (!claim) {
    return next(new ApiError(404, "Claim not found"));
  }
  if (claim.stage !== "account") {
    return next(new ApiError(400, "Claim is not in account stage"));
  }
  if (!["deduction_given", "user_response_pending"].includes(action)) {
    return next(new ApiError(400, "Invalid action for account team"));
  }
  if (action === "deduction_given") {
    if (!deductionAmt || isNaN(deductionAmt)) {
      return next(new ApiError(400, "Deduction amount is required"));
    }
    claim.status = "deduction_given";
    claim.deductionAmount = deductionAmt;
    claim.finalAmount -= deductionAmt;
    claim.deductionReason = message || "No reason provided";
    claim.stage = "user";
  }
  if (action === "account_rejected") {
    claim.status = "account_rejected";
    claim.stage = "admin";
  }
  if (action === "account_accepted") {
    claim.status = "account_accepted";
    claim.stage = "admin";
  }
  await claim.save();

  const reviewHistory = new ReviewHistory({
    claim: claim._id,
    actedBy: userId,
    role: "Account",
    action,
    message: message || "No message provided",
    totalAmtNow: claim.finalAmount,
  });
  await reviewHistory.save();
  claim.reviewHistory.push(reviewHistory._id);
  await claim.save();
  return res
    .status(200)
    .json(new ApiResponse(200, claim, `Claim ${action} successfully`));
});

// admin actions on claims
export const adminActionOnClaim = asyncHandler(async (req, res, next) => {
  const {  action } = req.body;
  const { claimId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  if (userRole !== "Admin") {
    return next(new ApiError(403, "Access denied: Admin privileges required"));
  }
  if (!claimId || !action) {
    return next(new ApiError(400, "Claim ID and action are required"));
  }
  const claim = await Claim.findById(claimId);
  if (!claim) {
    return next(new ApiError(404, "Claim not found"));
  }
  if (claim.stage !== "admin") {
    return next(new ApiError(400, "Claim is not in admin stage"));
  }
  if (!["admin_approved", "admin_rejected"].includes(action)) {
    return next(new ApiError(400, "Invalid action for admin"));
  }
  if (action === "admin_approved") {
    claim.status = "admin_approved";
    claim.stage = "done";
  }
  if (action === "admin_rejected") {
    claim.status = "admin_rejected";
    claim.stage = "done";
  }
  await claim.save();

  const reviewHistory = new ReviewHistory({
    claim: claim._id,
    actedBy: userId,
    role: "Admin",
    action,
    message: "Claim reviewed by admin",
    totalAmtNow: claim.finalAmount,
  });
  await reviewHistory.save();
  claim.reviewHistory.push(reviewHistory._id);
  await claim.save();
  return res
    .status(200)
    .json(new ApiResponse(200, claim, `Claim ${action} successfully`));
});

// user actions on claims
export const userActionOnClaim = asyncHandler(async (req, res, next) => {
  const {  action } = req.body;
  const { claimId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (userRole !== "User") {
    return next(new ApiError(403, "Access denied: User privileges required"));
  }

  if (!claimId || !action) {
    return next(new ApiError(400, "Claim ID and action are required"));
  }

  const claim = await Claim.findById(claimId);
  if (!claim) {
    return next(new ApiError(404, "Claim not found"));
  }

  if (claim.stage !== "user") {
    return next(new ApiError(400, "Claim is not in user stage"));
  }

  if (!["user_accepted", "user_disputed"].includes(action)) {
    return next(new ApiError(400, "Invalid action for user"));
  }

  if (action === "user_accepted") {
    claim.status = "user_accepted";
    claim.stage = "admin";
  } else if (action === "user_disputed") {
    claim.status = "user_disputed";
    claim.stage = "account";
  }

  await claim.save();

  const reviewHistory = new ReviewHistory({
    claim: claim._id,
    actedBy: userId,
    role: "User",
    action,
    message: "Claim action taken by user",
    totalAmtNow: claim.finalAmount,
  });

  await reviewHistory.save();
  claim.reviewHistory.push(reviewHistory._id);
  await claim.save();
  return res
    .status(200)
    .json(new ApiResponse(200, claim, `Claim ${action} successfully`));
});
