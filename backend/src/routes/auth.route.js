import express from "express";
import {
  accountPersonLogin,
  accountPersonRegister,
  adminLogin,
  adminRegister,
  refreshAccessToken,
  userLogin,
  userRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

// user authentication routes
router.route("/register-user").post(userRegister);
router.route("/login-user").post(userLogin);

// account authentication routes
router.route("/register-account-person").post(accountPersonRegister);
router.route("/login-account-person").post(accountPersonLogin);

// admin authentication routes
router.route("/register-admin").post(adminRegister);
router.route("/login-admin").post(adminLogin);

//refresh token 
router.route("/refresh-token").post(refreshAccessToken);
export default router;
