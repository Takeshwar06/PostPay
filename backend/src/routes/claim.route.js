import express from "express";
import {
  accountTeamAction,
  adminActionOnClaim,
  createClaim,
  getClaims,
  getClaimsByUser,
  userActionOnClaim,
} from "../controllers/claim.controller.js";
import {
  verifyAccountPerson,
  verifyAdmin,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/").post(verifyJWT, createClaim);
router.route("/").get(verifyJWT, verifyAccountPerson, getClaims);
router.route("/user").get(verifyJWT, getClaimsByUser);

router
  .route("/:claimId/account-action")
  .patch(verifyJWT, verifyAccountPerson, accountTeamAction);
router
  .route("/:claimId/admin-action")
  .patch(verifyJWT, verifyAdmin, adminActionOnClaim);
router.route("/:claimId/user-action").patch(verifyJWT, userActionOnClaim);

export default router;
