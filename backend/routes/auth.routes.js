import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controller/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile)
router.get("/checkAuth", protectRoute, checkAuth)
export default router;