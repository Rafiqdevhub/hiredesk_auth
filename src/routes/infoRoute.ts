import express from "express";
import { config } from "../config/env";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    api: "HireDesk Auth API",
    version: "3.1.0",
    description:
      "Complete authentication, email verification, and rate limiting system for HireDesk platform with user management, JWT authentication, secure email verification, and FastAPI integration.",
    status: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),

    architecture: {
      database: "NeonDB (PostgreSQL)",
      orm: "Drizzle ORM",
      authentication: "JWT with refresh tokens",
      security: "bcrypt password hashing",
      cors: "Configured for multiple origins",
      validation: "Express validation middleware",
      logging: "Morgan HTTP request logger",
    },

    features: [
      "User registration with name, email, password, company_name",
      "Secure login with JWT access tokens (15 minutes)",
      "HttpOnly refresh tokens (7 days) stored as secure cookies",
      "Automatic token refresh without user intervention",
      "Secure logout that clears both client and server tokens",
      "Password reset functionality with secure validation",
      "Protected profile endpoint with user data",
      "Email verification system with secure token-based verification",
      "Automatic verification email sending with modern HTML templates",
      "Email verification middleware for protected routes",
      "Resend verification email functionality",
      "Single-use verification tokens with 24-hour expiry",
      "Rate limiting for file uploads (10 files per user)",
      "Batch analysis tracking - counts batch resume analysis operations",
      "Resume comparison tracking - counts resume comparison operations",
      "FastAPI integration endpoints for all feature tracking",
      "Feature usage endpoints for analytics and dashboard display",
      "NeonDB (PostgreSQL) user storage with bcrypt password hashing",
      "JWT authentication with automatic token rotation",
      "CORS protection for multiple domains",
      "Comprehensive error handling and logging",
      "Atomic database operations to prevent race conditions",
    ],

    rateLimiting: {
      uploadLimit: config.upload.limit,
      description: "Users can upload maximum 10 files",
      batchAnalysisLimit: "Unlimited batch analysis operations per user",
      compareResumesLimit: "Unlimited resume comparison operations per user",
      endpoints: {
        checkUploads: "GET /api/auth/user-uploads/:email",
        incrementUploads: "POST /api/auth/increment-upload",
        uploadStats: "GET /api/auth/upload-stats",
        incrementBatchAnalysis: "POST /api/auth/increment-batch-analysis",
        incrementCompareResumes: "POST /api/auth/increment-compare-resumes",
        incrementSelectedCandidate:
          "POST /api/auth/increment-selected-candidate",
        featureUsage: "GET /api/auth/feature-usage/:email",
      },
      integration: "Designed for FastAPI backend integration",
    },

    security: {
      passwordHashing: "bcrypt with salt rounds",
      jwtTokens: "Access tokens (15min) + Refresh tokens (7 days)",
      cookieSecurity: "HttpOnly, Secure, SameSite cookies",
      corsProtection: "Multiple domain whitelist",
      headerSecurity: "X-Powered-By removed",
      errorHandling: "Production-safe error messages",
    },

    emailVerification: {
      overview:
        "Complete email verification system ensuring user authenticity and security",
      features: [
        "Automatic verification email on registration",
        "Secure token-based verification (32-byte cryptographically secure)",
        "24-hour token expiry with automatic cleanup",
        "Single-use tokens (invalidated after use)",
        "Modern responsive HTML email templates",
        "Copy-to-clipboard functionality in emails",
        "Email verification middleware for protected routes",
        "Resend verification email functionality",
        "Rate limiting to prevent abuse",
        "Comprehensive error handling and user feedback",
      ],
      flow: {
        registration: [
          "1. User submits registration form with name, email, password, company",
          "2. System validates input and creates user account (emailVerified: false)",
          "3. System generates cryptographically secure verification token (32 bytes)",
          "4. System sets verification expiry (24 hours from creation)",
          "5. System sends beautiful HTML verification email with token URL",
          "6. User account created but marked as unverified",
          "7. User receives JWT tokens but has limited access",
        ],
        verification: [
          "1. User clicks verification link in email or pastes URL manually",
          "2. Frontend sends POST /verify-email with token",
          "3. System validates token exists and hasn't expired",
          "4. System finds user by verification token",
          "5. System marks user as emailVerified: true",
          "6. System clears verification token and expiry (cleanup)",
          "7. System returns success response",
          "8. User now has full access to all features",
        ],
        middlewareProtection: [
          "1. Protected routes use requireEmailVerification middleware",
          "2. Middleware checks if user is authenticated",
          "3. Middleware queries database for emailVerified status",
          "4. If not verified, returns 403 with verification required message",
          "5. If verified, allows request to proceed",
          "6. Applied to profile, update-profile, and other sensitive endpoints",
        ],
        resendFlow: [
          "1. User requests new verification email",
          "2. System validates email exists in database",
          "3. System generates new verification token",
          "4. System updates verification expiry (24 hours)",
          "5. System sends new verification email",
          "6. User receives fresh verification link",
        ],
      },
      security: {
        tokenGeneration:
          "crypto.randomBytes(32).toString('hex') - 64 character secure token",
        tokenStorage: "Database stored as varchar(255) with proper indexing",
        tokenExpiry: "24 hours from generation, enforced at verification time",
        singleUse:
          "Tokens invalidated immediately after successful verification",
        rateLimiting: "Resend verification limited to prevent email spam",
        cleanup: "Expired tokens remain in DB but are non-functional",
        emailSecurity: "No sensitive data in verification URLs",
        httpsRequired:
          "Production deployment requires HTTPS for secure token transmission",
      },
      emailService: {
        provider: "Nodemailer with SMTP configuration",
        templates: "Modern responsive HTML with gradient design and emojis",
        features:
          "Copy-to-clipboard button, fallback URL display, mobile responsive",
        smtpConfig: {
          host: "Configured via environment variables",
          port: "587 (TLS) or 465 (SSL)",
          secure: "TLS preferred for security",
          auth: "Username and password from environment",
        },
        templateFeatures: [
          "Beautiful gradient header with logo",
          "Responsive design for all devices",
          "Copy-to-clipboard JavaScript functionality",
          "Fallback URL display for email clients without JS",
          "Professional styling with modern fonts",
          "Clear call-to-action buttons",
          "Security notices and expiry warnings",
          "Company branding and contact information",
        ],
      },
      middleware: {
        requireEmailVerification: {
          purpose: "Protects sensitive routes from unverified users",
          implementation:
            "Express middleware function executed after authentication",
          databaseCheck: "Queries users table for emailVerified boolean field",
          errorResponse: {
            status: 403,
            message: "Email verification required",
            requiresVerification: true,
          },
          appliedRoutes: [
            "GET /api/auth/profile",
            "PUT /api/auth/update-profile",
            "Any future sensitive endpoints",
          ],
        },
      },
      database: {
        schema: {
          emailVerified: "boolean default false not null - verification status",
          verificationToken: "varchar(255) - stores current verification token",
          verificationExpires: "timestamp - token expiry date/time",
        },
        migration: "Added in migration 0004_white_giant_man.sql",
        indexing: "verificationToken should be indexed for performance",
        cleanup: "Expired tokens can be cleaned up periodically (optional)",
      },
      configuration: {
        environmentVariables: {
          EMAIL_HOST: "SMTP server hostname",
          EMAIL_PORT: "SMTP server port (587/465)",
          EMAIL_SECURE: "Use TLS/SSL (true/false)",
          EMAIL_USER: "SMTP authentication username",
          EMAIL_PASS: "SMTP authentication password",
          EMAIL_FROM: "Sender email address",
          FRONTEND_URL: "Frontend URL for verification links",
        },
        tokenSettings: {
          VERIFICATION_TOKEN_LENGTH: "32 bytes (64 hex characters)",
          VERIFICATION_EXPIRY_HOURS: "24 hours",
          TOKEN_CLEANUP: "Automatic on verification",
        },
      },
      errorHandling: {
        tokenExpired: {
          code: "TOKEN_EXPIRED",
          status: 400,
          message: "Verification token has expired",
          suggestion: "Request new verification email",
        },
        tokenInvalid: {
          code: "TOKEN_INVALID",
          status: 400,
          message: "Invalid verification token",
          suggestion: "Check token or request new verification email",
        },
        emailNotFound: {
          code: "EMAIL_NOT_FOUND",
          status: 404,
          message: "No account found with this email address",
          suggestion: "Check email address or register new account",
        },
        alreadyVerified: {
          code: "ALREADY_VERIFIED",
          status: 400,
          message: "Email is already verified",
          suggestion: "You can now access all features",
        },
        verificationRequired: {
          code: "VERIFICATION_REQUIRED",
          status: 403,
          message: "Email verification required",
          requiresVerification: true,
          suggestion: "Check your email for verification link",
        },
      },
      testing: {
        unitTests:
          "authController.test.ts includes comprehensive email verification tests",
        testCoverage:
          "Token generation, expiry validation, email sending, middleware",
        mockServices:
          "Email service mocked to prevent actual email sending in tests",
        integrationTests:
          "Full verification flow testing with database state validation",
      },
    },

    passwordReset: {
      overview:
        "Complete 2-step password reset flow ensuring security and user authentication",
      twoStepProcess: {
        step1:
          "User requests password reset via email (forgotPassword endpoint)",
        step2:
          "User receives email with secure token and resets password within 24 hours (resetPasswordWithToken endpoint)",
      },
      features: [
        "Secure 2-step password reset process",
        "Cryptographically secure tokens (32-byte random)",
        "24-hour token expiry with automatic invalidation",
        "Single-use tokens (invalidated after use)",
        "Email enumeration prevention (always returns success)",
        "Strong password validation (8+ chars, uppercase, lowercase, number)",
        "Modern responsive HTML email templates with reset link",
        "Automatic token cleanup after successful reset",
        "Copy-to-clipboard functionality in emails",
        "Comprehensive error handling and user feedback",
      ],
      flow: {
        requestReset: [
          "1. User submits email via /forgot-password endpoint",
          "2. System validates email format",
          "3. System normalizes email (lowercase, trim)",
          "4. For security: always returns success message",
          "5. If user exists: generates 32-byte secure token",
          "6. System sets token expiry (24 hours from now)",
          "7. System stores token in database linked to user",
          "8. System sends beautiful HTML password reset email",
          "9. User receives email with secure reset link containing token",
        ],
        resetPassword: [
          "1. User clicks reset link or manually navigates to reset page",
          "2. Frontend extracts token from URL query parameter",
          "3. Frontend sends POST /reset-password-with-token with token + new password",
          "4. System validates token format",
          "5. System finds user by reset token in database",
          "6. System validates token hasn't expired (24-hour check)",
          "7. System validates password meets strength requirements",
          "8. System validates password and confirm password match",
          "9. System hashes new password with bcrypt",
          "10. System updates password in database",
          "11. System clears reset token and expiry (cleanup)",
          "12. System returns success message",
          "13. User can now login with new password",
        ],
      },
      security: {
        tokenGeneration:
          "crypto.randomBytes(32).toString('hex') - 64 character cryptographically secure token",
        tokenStorage: "Database stored as varchar(255) with proper indexing",
        tokenExpiry: "24 hours from generation, enforced during reset",
        singleUse:
          "Tokens invalidated immediately after successful password reset",
        emailEnumeration:
          "Prevented by always returning success (no indication if email exists)",
        passwordValidation: {
          minLength: "8 characters",
          requirements: [
            "At least one uppercase letter (A-Z)",
            "At least one lowercase letter (a-z)",
            "At least one number (0-9)",
            "Cannot contain only spaces",
          ],
        },
        rateLimiting: "No rate limiting on forgot-password (always succeeds)",
        cleanup: "Tokens automatically cleared after successful reset",
        httpsRequired:
          "Production deployment requires HTTPS for secure token transmission",
        errorMessages: "Generic error messages prevent information disclosure",
      },
      emailService: {
        provider: "Nodemailer with SMTP configuration",
        templates: "Modern responsive HTML with orange gradient design",
        features:
          "Copy-to-clipboard button, fallback URL display, mobile responsive, security notices",
        contentInclusion: [
          "User's name and greeting",
          "Security notice about token expiry (24 hours)",
          "Reset link with embedded token (production uses frontend URL)",
          "Fallback text URL for email clients without JavaScript",
          "Copy-to-clipboard button for easy token handling",
          "Instructions for resetting password",
          "Security warning about not sharing email",
          "Contact support link",
          "HireDesk branding and footer",
        ],
      },
      database: {
        schema: {
          resetToken: "varchar(255) - stores current reset token",
          resetTokenExpires: "timestamp - token expiry date/time",
        },
        migration: "Added in migration 0005_add_password_reset.sql",
        indexing: "resetToken should be indexed for performance",
        cleanup: "Tokens automatically cleared after successful reset",
      },
      utilities: {
        file: "src/utils/passwordReset.ts",
        functions: [
          {
            name: "generatePasswordResetToken()",
            purpose: "Generate 32-byte cryptographically secure token",
            returns: "64-character hex string",
          },
          {
            name: "generatePasswordResetExpiry()",
            purpose: "Generate 24-hour expiry timestamp",
            returns: "Date object (current time + 24 hours)",
          },
          {
            name: "isPasswordResetTokenExpired(expiry: Date | null)",
            purpose: "Check if token has passed expiry time",
            returns: "boolean (true if expired)",
          },
          {
            name: "validatePassword(password: string)",
            purpose: "Validate password meets strength requirements",
            returns: "{ isValid: boolean, message?: string }",
          },
          {
            name: "validateEmailFormat(email: string)",
            purpose: "Validate email format using regex",
            returns: "boolean (true if valid format)",
          },
          {
            name: "normalizeEmail(email: string)",
            purpose: "Normalize email (lowercase, trim whitespace)",
            returns: "string (normalized email)",
          },
        ],
      },
      configuration: {
        environmentVariables: {
          EMAIL_HOST: "SMTP server hostname",
          EMAIL_PORT: "SMTP server port (587/465)",
          EMAIL_SECURE: "Use TLS/SSL (true/false)",
          EMAIL_USER: "SMTP authentication username",
          EMAIL_PASS: "SMTP authentication password",
          EMAIL_FROM: "Sender email address",
          FRONTEND_URL: "Frontend URL for password reset links",
        },
        tokenSettings: {
          RESET_TOKEN_LENGTH: "32 bytes (64 hex characters)",
          RESET_TOKEN_EXPIRY_HOURS: "24 hours",
          PASSWORD_MIN_LENGTH: "8 characters",
          TOKEN_CLEANUP: "Automatic on successful reset",
        },
      },
      errorHandling: {
        emailRequired: {
          code: "EMAIL_REQUIRED",
          status: 400,
          message: "Email is required",
          suggestion: "Provide email address for password reset",
        },
        invalidEmailFormat: {
          code: "INVALID_EMAIL_FORMAT",
          status: 400,
          message: "Invalid email format",
          suggestion: "Enter a valid email address",
        },
        tokenRequired: {
          code: "TOKEN_REQUIRED",
          status: 400,
          message: "Reset token is required",
          suggestion: "Use the link from your password reset email",
        },
        passwordRequired: {
          code: "PASSWORD_REQUIRED",
          status: 400,
          message: "New password is required",
          suggestion: "Enter a new password",
        },
        confirmPasswordRequired: {
          code: "CONFIRM_PASSWORD_REQUIRED",
          status: 400,
          message: "Password confirmation is required",
          suggestion: "Confirm your new password",
        },
        passwordsMismatch: {
          code: "PASSWORDS_MISMATCH",
          status: 400,
          message: "Passwords do not match",
          suggestion: "Ensure new password and confirm password are identical",
        },
        weakPassword: {
          code: "WEAK_PASSWORD",
          status: 400,
          message: "Password does not meet requirements",
          suggestion:
            "Password must be 8+ chars with uppercase, lowercase, and number",
        },
        invalidToken: {
          code: "INVALID_TOKEN",
          status: 400,
          message: "Invalid or expired reset token",
          suggestion: "Request a new password reset email",
        },
        tokenExpired: {
          code: "TOKEN_EXPIRED",
          status: 400,
          message: "Reset token has expired (24-hour limit)",
          suggestion: "Request a new password reset email",
        },
      },
      testing: {
        unitTests:
          "authController.test.ts includes 17 comprehensive password reset tests",
        testCoverage: [
          "Email validation (required, format)",
          "Token validation (required, format, expiry)",
          "Password validation (strength, match, required)",
          "Security (email enumeration prevention, single-use tokens)",
          "Success flows (token generation, email sending, password reset)",
          "Error handling (invalid input, expired tokens, weak passwords)",
          "Edge cases (email sending failure, database errors)",
        ],
        mockServices:
          "Email service mocked to prevent actual email sending in tests",
        testFile: "tests/controllers/authController.test.ts",
      },
    },

    endpoints: [
      {
        category: "Authentication",
        method: "POST",
        path: "/api/auth/register",
        description: "Register a new user account",
        authentication: "None",
        requestBody: {
          name: "string (required)",
          email: "string (required, unique)",
          password: "string (required, min 6 chars)",
          company_name: "string (required)",
        },
        response:
          "User data + access token + refresh token cookie + verification email sent",
        notes:
          "Creates user account, sends verification email, and logs them in immediately. Email verification required for full access.",
      },
      {
        category: "Authentication",
        method: "POST",
        path: "/api/auth/login",
        description: "Login with email and password",
        authentication: "None",
        requestBody: {
          email: "string (required)",
          password: "string (required)",
        },
        response: "User data + access token + refresh token cookie",
        notes: "Sets HttpOnly refresh token cookie for 7 days",
      },
      {
        category: "Email Verification",
        method: "POST",
        path: "/api/auth/verify-email",
        description: "Verify user's email address with verification token",
        authentication: "None",
        requestBody: {
          token: "string (required) - Verification token from email",
        },
        response: {
          success: "boolean",
          message: "string",
          email: "string",
          verified: "boolean",
        },
        notes:
          "Validates token, marks email as verified, clears verification data. Token expires in 24 hours and is single-use.",
      },
      {
        category: "Email Verification",
        method: "POST",
        path: "/api/auth/resend-verification",
        description: "Resend verification email to user",
        authentication: "None",
        requestBody: {
          email: "string (required) - User's email address",
        },
        response: {
          success: "boolean",
          message: "string",
          email: "string",
        },
        notes:
          "Generates new verification token, updates expiry, sends new verification email. Rate limited to prevent abuse.",
      },
      {
        category: "Authentication",
        method: "POST",
        path: "/api/auth/refresh",
        description: "Refresh access token using refresh token",
        authentication: "Refresh token (cookie)",
        requestBody: "None",
        response: "New access token + rotated refresh token cookie",
        notes: "Automatically rotates refresh token for security",
      },
      {
        category: "Authentication",
        method: "POST",
        path: "/api/auth/logout",
        description: "Logout and clear all tokens",
        authentication: "Access token (optional)",
        requestBody: "None",
        response: "Success message",
        notes: "Clears refresh token cookie and invalidates tokens",
      },
      {
        category: "Authentication",
        method: "POST",
        path: "/api/auth/reset-password",
        description: "Reset user password",
        authentication: "None",
        requestBody: {
          email: "string (required)",
          newPassword: "string (required, min 6 chars)",
        },
        response: "Success message",
        notes: "Updates password in database with bcrypt hashing",
      },
      {
        category: "Password Reset",
        method: "POST",
        path: "/api/auth/forgot-password",
        description:
          "Request password reset email (Step 1 of 2-step password reset flow)",
        authentication: "None",
        requestBody: {
          email: "string (required) - User's email address",
        },
        response: {
          success: "boolean",
          message:
            "If an account exists with this email, a password reset link has been sent",
        },
        errorCodes: {
          EMAIL_REQUIRED: {
            status: 400,
            message: "Email is required",
          },
          INVALID_EMAIL_FORMAT: {
            status: 400,
            message: "Invalid email format",
          },
        },
        notes:
          "Always returns success for security (prevents email enumeration attacks). If user exists, generates secure reset token (32-byte crypto), sets 24-hour expiry, and sends beautiful HTML email with reset link. For non-existent emails, returns success without sending anything.",
        security:
          "Implements security-first design: no email enumeration, single-use tokens, 24-hour expiry, cryptographically secure token generation",
      },
      {
        category: "Password Reset",
        method: "POST",
        path: "/api/auth/reset-password-with-token",
        description:
          "Complete password reset with token (Step 2 of 2-step password reset flow)",
        authentication: "None",
        requestBody: {
          token: "string (required) - Password reset token from email",
          newPassword:
            "string (required) - New password (min 8 chars, uppercase, lowercase, number)",
          confirmPassword:
            "string (required) - Confirm new password (must match newPassword)",
        },
        response: {
          success: "boolean",
          message:
            "Password has been reset successfully. You can now log in with your new password.",
        },
        errorCodes: {
          TOKEN_REQUIRED: {
            status: 400,
            message: "Reset token is required",
          },
          PASSWORD_REQUIRED: {
            status: 400,
            message: "New password is required",
          },
          CONFIRM_PASSWORD_REQUIRED: {
            status: 400,
            message: "Password confirmation is required",
          },
          PASSWORDS_MISMATCH: {
            status: 400,
            message: "Passwords do not match",
          },
          WEAK_PASSWORD: {
            status: 400,
            message:
              "Password does not meet requirements (min 8 chars, uppercase, lowercase, number)",
          },
          INVALID_TOKEN: {
            status: 400,
            message: "Invalid or expired reset token",
          },
          TOKEN_EXPIRED: {
            status: 400,
            message:
              "Reset token has expired. Please request a new password reset.",
          },
        },
        notes:
          "Validates token existence and 24-hour expiry. Enforces strong password requirements. Updates password with bcrypt hashing. Single-use tokens (automatically cleared after use). User must complete within 24 hours or request new reset email.",
        security:
          "Strong password validation (8+ chars, uppercase, lowercase, number), secure token validation, single-use tokens, automatic token cleanup",
      },
      {
        category: "Authentication",
        method: "PUT",
        path: "/api/auth/update-profile",
        description:
          "Update authenticated user's profile (name and/or password)",
        authentication:
          "Access token (required) + Email verification (required)",
        requestBody: {
          name: "string (optional) - Update user's name",
          currentPassword: "string (required if updating password)",
          newPassword: "string (optional) - New password (min 8 chars)",
          confirmPassword:
            "string (required if updating password, must match newPassword)",
        },
        response: {
          success: "boolean",
          message: "string",
          data: {
            id: "string",
            name: "string",
            email: "string",
            company_name: "string",
            filesUploaded: "number",
            updatedAt: "string (ISO)",
            securityNote: "string (only if password changed)",
          },
        },
        notes:
          "Update name, password, or both. Password changes require current password verification and log out other devices. Requires email verification.",
      },
      {
        category: "Authentication",
        method: "GET",
        path: "/api/auth/profile",
        description: "Get authenticated user's profile data",
        authentication:
          "Access token (required) + Email verification (required)",
        requestBody: "None",
        response:
          "User profile data (id, name, email, company_name, filesUploaded, createdAt)",
        notes:
          "Returns complete user profile information. Requires email verification.",
      },
      {
        category: "Rate Limiting",
        method: "GET",
        path: "/api/auth/user-uploads/:email",
        description: "Get user's current upload count by email",
        authentication: "None (Public - for FastAPI service)",
        requestBody: "None",
        response: {
          success: "boolean",
          email: "string",
          filesUploaded: "number",
          limit: "number (10)",
          remaining: "number",
          message: "string",
        },
        notes:
          "Used by FastAPI backend to check upload limits before processing",
      },
      {
        category: "Rate Limiting",
        method: "POST",
        path: "/api/auth/increment-upload",
        description: "Increment user's upload count after successful upload",
        authentication: "None (Public - for FastAPI service)",
        requestBody: {
          email: "string (required)",
        },
        response: {
          success: "boolean",
          message: "string",
          email: "string",
          filesUploaded: "number",
          limit: "number (10)",
          remaining: "number",
        },
        notes:
          "Called by FastAPI after successful file processing to increment count",
      },
      {
        category: "Rate Limiting",
        method: "POST",
        path: "/api/auth/increment-batch-analysis",
        description:
          "Increment user's batch analysis count after successful batch processing",
        authentication: "None (Public - for FastAPI service)",
        requestBody: {
          email: "string (required)",
        },
        response: {
          success: "boolean",
          message: "string",
          email: "string",
          batch_analysis: "number",
          filesUploaded: "number",
          compare_resumes: "number",
        },
        notes:
          "Called by FastAPI after successful batch analysis to track feature usage",
      },
      {
        category: "Rate Limiting",
        method: "POST",
        path: "/api/auth/increment-compare-resumes",
        description:
          "Increment user's resume comparison count after successful comparison",
        authentication: "None (Public - for FastAPI service)",
        requestBody: {
          email: "string (required)",
        },
        response: {
          success: "boolean",
          message: "string",
          email: "string",
          compare_resumes: "number",
          filesUploaded: "number",
          batch_analysis: "number",
        },
        notes:
          "Called by FastAPI after successful resume comparison to track feature usage",
      },
      {
        category: "Rate Limiting",
        method: "GET",
        path: "/api/auth/feature-usage/:email",
        description: "Get comprehensive feature usage statistics for a user",
        authentication: "None (Public - for FastAPI service and dashboard)",
        requestBody: "None",
        response: {
          success: "boolean",
          message: "string",
          email: "string",
          stats: {
            filesUploaded: "number (count of files uploaded)",
            batch_analysis: "number (count of batch analysis operations)",
            compare_resumes: "number (count of resume comparisons)",
            totalFeatureUsage: "number (sum of all feature counters)",
          },
        },
        notes:
          "Consolidated endpoint for retrieving all feature usage statistics. Used for analytics, dashboards, and rate limit checks.",
      },

      // JWT Verification Endpoints (Cross-Service Communication)
      {
        category: "JWT Verification",
        method: "POST",
        path: "/api/auth/verify-token",
        description: "Verify JWT token validity and decode payload",
        authentication: "None (Public - for debugging and FastAPI integration)",
        requestBody: {
          token: "string (required) - JWT token to verify",
        },
        response: {
          success: "boolean",
          message: "string",
          decoded: "object (token payload)",
          tokenInfo: {
            algorithm: "string",
            expiresIn: "string",
            secretLength: "number",
          },
        },
        notes:
          "Use this endpoint to verify if JWT tokens are valid and properly signed. Useful for debugging 403 Forbidden errors.",
      },
      {
        category: "JWT Verification",
        method: "GET",
        path: "/api/auth/jwt-info",
        description: "Get JWT configuration information for debugging",
        authentication: "None (Public - for cross-service setup)",
        requestBody: "None",
        response: {
          success: "boolean",
          jwtInfo: {
            algorithm: "string (HS256)",
            accessTokenExpiry: "string",
            refreshTokenExpiry: "string",
            secretLength: "number",
            secretFirstChars: "string",
            secretLastChars: "string",
            environment: "string",
          },
        },
        notes:
          "Share this information with FastAPI team to ensure JWT secrets match. Helps resolve authentication issues.",
      },

      {
        category: "System",
        method: "GET",
        path: "/health",
        description: "Health check endpoint for monitoring",
        authentication: "None",
        requestBody: "None",
        response: {
          status: "string (OK)",
          service: "string",
          uptime: "number (seconds)",
          timestamp: "string (ISO)",
        },
        notes: "Used for health monitoring and load balancer checks",
      },
      {
        category: "System",
        method: "GET",
        path: "/",
        description: "API documentation and system information",
        authentication: "None",
        requestBody: "None",
        response: "Complete API documentation (this response)",
        notes: "Comprehensive system documentation and endpoint reference",
      },
    ],

    integration: {
      fastapi: {
        description:
          "Seamless integration with FastAPI backend for file processing and feature tracking",
        workflow: [
          "1. Frontend authenticates user with this service",
          "2. Frontend receives JWT access token",
          "3. Frontend sends file + JWT to FastAPI backend",
          "4. FastAPI validates JWT and checks upload limit via GET /user-uploads/:email",
          "5. FastAPI processes file if under limit",
          "6. FastAPI increments count via POST /increment-upload",
          "7. For batch analysis: FastAPI calls POST /increment-batch-analysis after processing",
          "8. For resume comparison: FastAPI calls POST /increment-compare-resumes after processing",
          "9. User feature usage tracked in real-time via GET /feature-usage/:email",
          "10. Dashboard displays all feature counters for user analytics",
        ],
        endpoints: {
          checkLimit: "GET /api/auth/user-uploads/:email",
          incrementCount: "POST /api/auth/increment-upload",
          incrementBatchAnalysis: "POST /api/auth/increment-batch-analysis",
          incrementCompareResumes: "POST /api/auth/increment-compare-resumes",
          incrementSelectedCandidate:
            "POST /api/auth/increment-selected-candidate",
          featureUsage: "GET /api/auth/feature-usage/:email",
        },
      },
      cors: {
        allowedOrigins: config.corsOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        headers: ["Content-Type", "Authorization"],
      },
    },

    operationDetails: {
      emailValidation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        requirement: "Valid email format required",
        normalization: "All emails converted to lowercase for consistency",
        appliedTo: [
          "POST /increment-upload",
          "POST /increment-batch-analysis",
          "POST /increment-compare-resumes",
          "GET /user-uploads/:email",
          "GET /feature-usage/:email",
        ],
      },
      atomicIncrement: {
        description: "Database-level atomic increment prevents race conditions",
        implementation: "sql`${column} + 1` executed at database level",
        benefit: "Ensures accurate counting even with concurrent requests",
        appliedTo: ["filesUploaded", "batch_analysis", "compare_resumes"],
        concurrencyGuarantee:
          "100% accuracy with unlimited concurrent requests",
      },
      errorResponses: {
        format: {
          success: "boolean",
          message: "string",
          error: "string (error code)",
          data: "optional (varies by endpoint)",
        },
        commonErrors: {
          invalidEmail: {
            code: "INVALID_EMAIL",
            status: 400,
            message: "Email format validation failed",
          },
          userNotFound: {
            code: "USER_NOT_FOUND",
            status: 404,
            message: "User with specified email does not exist",
          },
          internalError: {
            code: "INTERNAL_ERROR",
            status: 500,
            message: "Database operation or server error",
          },
          unauthorized: {
            code: "UNAUTHORIZED",
            status: 401,
            message: "Authentication required or token invalid",
          },
        },
      },
      responsePatterns: {
        incrementOperations: {
          description: "All POST endpoints return updated counters",
          returns: [
            "success",
            "message",
            "email",
            "filesUploaded",
            "batch_analysis",
            "compare_resumes",
          ],
        },
        getOperations: {
          description: "All GET endpoints return current counter values",
          returns: ["success", "message", "stats (with all counters)"],
        },
      },
    },

    errorHandling: {
      development: "Detailed error messages with stack traces",
      production: "Sanitized error messages for security",
      statusCodes: {
        200: "Success",
        400: "Bad Request - Invalid input data",
        401: "Unauthorized - Invalid or missing token",
        403: "Forbidden - Insufficient permissions",
        404: "Not Found - Resource doesn't exist",
        500: "Internal Server Error - Server-side error",
      },
      errorFormat: {
        success: "boolean (false)",
        message: "string (error description)",
        error: "string (error code)",
        details: "string (development only)",
      },
    },

    database: {
      tables: {
        users: {
          id: "serial (primary key)",
          name: "varchar(255) not null",
          email: "varchar(255) not null unique",
          company_name: "varchar(255) not null",
          password: "varchar(255) not null (bcrypt hashed)",
          refreshToken: "varchar(255) nullable",
          filesUploaded: "integer default 0 not null (count of uploaded files)",
          batch_analysis:
            "integer default 0 not null (count of batch analysis operations)",
          compare_resumes:
            "integer default 0 not null (count of resume comparisons)",
          selected_candidate:
            "integer default 0 not null (count of selected candidates - tracked for rate limiting)",
          emailVerified:
            "boolean default false not null (email verification status)",
          verificationToken:
            "varchar(255) nullable (current verification token)",
          verificationExpires: "timestamp nullable (token expiry date/time)",
          created_at: "timestamp default now()",
          updated_at: "timestamp default now()",
        },
        fieldDescriptions: {
          filesUploaded:
            "Tracks number of resume files uploaded by user (max 10)",
          batch_analysis:
            "Counts how many batch analysis operations user has performed",
          compare_resumes:
            "Counts how many resume comparison operations user has performed",
          selected_candidate:
            "Counts how many candidates the user has selected (limit enforced)",
          emailVerified:
            "Boolean flag indicating if user has verified their email address",
          verificationToken:
            "Stores the current email verification token (32-byte secure random)",
          verificationExpires:
            "Timestamp when the current verification token expires (24 hours)",
        },
      },
    },

    performance: {
      uptime: `${Math.floor(process.uptime())} seconds`,
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      environment: config.nodeEnv,
    },

    featureTracking: {
      overview:
        "Complete analytics system for tracking user activities across the HireDesk platform",
      counters: {
        filesUploaded: {
          description: "Resume files uploaded by user",
          limit: "10 files maximum",
          incremented: "When FastAPI successfully processes a file upload",
          tracked: "Yes - for rate limiting and quota management",
          resetCycle: "Never - accumulates indefinitely",
          useCase: "Prevent users from uploading more than 10 resumes",
        },
        batch_analysis: {
          description: "Batch analysis operations performed",
          limit: "Unlimited",
          incremented:
            "When FastAPI completes a batch analysis of multiple resumes",
          tracked: "Yes - for analytics and usage statistics",
          resetCycle: "Never - accumulates indefinitely",
          useCase: "Track feature usage for premium analytics and dashboards",
        },
        compare_resumes: {
          description: "Resume comparison operations performed",
          limit: "Unlimited",
          incremented: "When FastAPI completes a resume comparison operation",
          tracked: "Yes - for analytics and usage statistics",
          resetCycle: "Never - accumulates indefinitely",
          useCase: "Track feature usage for premium analytics and dashboards",
        },
        selected_candidate: {
          description: "Number of candidates selected by the user",
          limit: "10 selections maximum",
          incremented:
            "When user selects a candidate (FastAPI or frontend calls increment-selected-candidate)",
          tracked: "Yes - used for rate limiting selected candidate actions",
          resetCycle: "Never - accumulates until manually reset by admin",
          useCase: "Enforce selection quota and prevent abuse",
        },
      },
      endpoints: {
        trackUpload: {
          method: "POST",
          path: "/api/auth/increment-upload",
          usedBy: "FastAPI after file upload processing",
          atomic: true,
          description:
            "Increments filesUploaded counter atomically to prevent race conditions",
        },
        trackBatchAnalysis: {
          method: "POST",
          path: "/api/auth/increment-batch-analysis",
          usedBy: "FastAPI after batch analysis completes",
          atomic: true,
          description:
            "Increments batch_analysis counter atomically for analytics",
        },
        trackCompareResumes: {
          method: "POST",
          path: "/api/auth/increment-compare-resumes",
          usedBy: "FastAPI after resume comparison completes",
          atomic: true,
          description:
            "Increments compare_resumes counter atomically for analytics",
        },
        trackSelectedCandidate: {
          method: "POST",
          path: "/api/auth/increment-selected-candidate",
          usedBy: "FastAPI or frontend after user selects a candidate",
          atomic: true,
          description:
            "Increments selected_candidate counter atomically and enforces selection quota",
        },
        retrieveStats: {
          method: "GET",
          path: "/api/auth/feature-usage/:email",
          usedBy: "Frontend dashboard, analytics, and FastAPI quota checks",
          atomic: false,
          description: "Retrieves consolidated feature usage statistics",
        },
      },
      atomicOperations: {
        description:
          "All increment operations use database-level atomic increments",
        benefit:
          "Prevents race conditions when multiple requests happen simultaneously",
        sqlPattern: "sql`${column} + 1` ensures database handles the increment",
        concurrencySafe: true,
      },
    },

    documentation:
      "Complete authentication, email verification, and rate limiting system for HireDesk platform. Features JWT authentication with email verification, secure token-based verification, modern HTML email templates, file upload tracking, FastAPI integration, and comprehensive security measures. Built with TypeScript, Express.js, Drizzle ORM, and PostgreSQL.",
  });
});

export default router;
