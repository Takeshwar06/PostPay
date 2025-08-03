import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

viewSchema.index({ postId: 1, userId: 1 }, { unique: true });

const View = mongoose.model("View", viewSchema);

export default View;
