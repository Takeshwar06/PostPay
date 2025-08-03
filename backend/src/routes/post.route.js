import express from "express";
import {
  addViewToPost,
  createPost,
  getPosts,
  togglePostLike,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route("/").post(verifyJWT,upload.single("image"),createPost);
router.route("/").get(verifyJWT,getPosts);
router.route("/:userId").get(verifyJWT,getPosts);
router.route("/toggle-like/:postId").patch(verifyJWT,togglePostLike);
router.route("/add-view/:postId").patch(verifyJWT,addViewToPost);

export default router;
