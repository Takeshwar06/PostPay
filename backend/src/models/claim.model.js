import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    posts: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        screenshot: { type: String },
      },
    ],

    totalLikes: Number,
    totalViews: Number,
    requestedAmount: Number,
    finalAmount: Number,

    status: {
      type: String,
      enum: [
        "pending",
        "deduction_given",
        "user_accepted",
        "user_disputed",
        "account_accepted",
        "account_rejected",
        "admin_approved",
        "admin_rejected",
      ],
      default: "pending",
    },

    stage: {
      type: String,
      enum: ["user", "account", "admin", "done"],
      default: "account",
    },

    deductionReason: String,
    deductionAmount: Number,
    userNote: String,

    reviewHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewHistory",
      },
    ],
  },
  { timestamps: true }
);

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;
