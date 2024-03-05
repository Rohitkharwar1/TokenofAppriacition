import express from "express";
import {
  authUser,
  createUser,
  logoutUser,
  userProfile,
  updateUser,
  getUser,
  getAllUser,
} from "../controllers/user.js";
import { protect, admin } from "../middlewares/auth.js";
const router = express.Router();

router.post("/", createUser);

router.post("/login", authUser);

router.post("/logout", logoutUser);

router.route("/profile").get(protect, userProfile).put(protect, updateUser);

router.get("/:id", admin, getUser);
router.get("/", protect, getAllUser);

export default router;
