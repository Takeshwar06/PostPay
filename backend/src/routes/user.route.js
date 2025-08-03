import express from "express";

import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { getUsers, updateUserRole } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/").get(verifyJWT, verifyAdmin, getUsers);
router.route("/role/:userId").patch(verifyJWT, verifyAdmin, updateUserRole);

export default router;
