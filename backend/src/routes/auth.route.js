import express from "express";
import { signup, login, logout, updateProfilePic, checkAuth, updateLanguage } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-pfp", protectRoute, updateProfilePic)
router.put("/update-lang", protectRoute, updateLanguage)

router.get("/check", protectRoute, checkAuth)

export default router;