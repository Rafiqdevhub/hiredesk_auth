import express from "express";
import {
  register,
  login,
  resetPassword,
  refresh,
  logout,
  getProfile,
  updateProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPasswordWithToken,
  internalVerifyEmailForTest,
} from "../controllers/authController";
import { verifyToken, getJWTInfo } from "../controllers/jwtController";
import { authenticate } from "../middleware/auth";
import { requireEmailVerification } from "../middleware/emailVerification";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password-with-token", resetPasswordWithToken);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.put(
  "/update-profile",
  authenticate,
  requireEmailVerification,
  updateProfile
);
router.get("/profile", authenticate, requireEmailVerification, getProfile);

// Internal test endpoint (development/testing only)
router.post("/internal/verify-email-for-test", internalVerifyEmailForTest);

//  (for cross-service communication)
router.post("/verify-token", verifyToken);
router.get("/jwt-info", getJWTInfo);

// Service info endpoint for health checks
router.get("/info", (req, res) => {
  res.json({
    api: "HireDesk Auth API",
    version: "3.1.0",
    status: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

export default router;
