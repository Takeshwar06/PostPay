import mongoose from "mongoose";
import { roles } from "../constants.js";

const reviewHistorySchema = new mongoose.Schema(
  {
    claim: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
    actedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: roles,
    },
    action: {
      type: String,
      enum: [
        "claim_submitted",
        "deduction_given",
        "user_accepted_deduction",
        "user_disputed_deduction",
        "account_accepted_user_response",
        "account_rejected_user_response",
        "admin_approved",
        "admin_rejected",
      ],
    },
    message: String,
    totalAmtNow: Number,
  },
  { timestamps: true }
);

const ReviewHistory = mongoose.model("ReviewHistory", reviewHistorySchema);
export default ReviewHistory;
