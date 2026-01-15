# HireDesk Backend API - Authentication Service

## Overview

HireDesk is a secure backend API built with Node.js, Express, TypeScript, and NeonDB (PostgreSQL) that provides authentication and file counting services. The system implements industry-standard security practices with JWT access tokens and HttpOnly refresh tokens.

## Architecture

### Core Technologies

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: NeonDB (PostgreSQL) with Drizzle ORM
- **Authentication**: JWT (Access + Refresh Tokens)
- **Security**: bcrypt password hashing, HttpOnly cookies
- **File Handling**: Multer for multipart file processing (counting only)

### Security Features

- **Access Tokens**: Short-lived (15 minutes) JWT tokens
- **Refresh Tokens**: Long-lived (7 days) HttpOnly cookies
- **Token Rotation**: Automatic refresh token renewal
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Cookie Security**: HttpOnly, SameSite=Strict, Secure flags

## Project Structure

```text
├── src/
│   ├── config/
│   │   ├── index.ts           # Database connection (NeonDB)
│   │   └── multer.ts           # File count configuration
│   ├── controllers/
│   │   ├── authController.ts   # Authentication logic
│   │   └── fileController.ts   # File count logic
│   ├── middleware/
│   │   └── auth.ts             # JWT authentication middleware
│   ├── models/
│   │   ├── user.ts             # User schema
│   │   └── refreshToken.ts     # Refresh token schema
│   ├── routes/
│   │   ├── authRoutes.ts       # Auth endpoints
│   │   └── fileRoutes.ts       # File count routes
│   ├── types/
│   │   └── auth.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── auth.ts             # JWT utilities
│   └── index.ts                # Main server file
├── tests/                      # Jest test suites (37 tests)
├── .github/workflows/          # GitHub Actions CI/CD pipeline
├── uploads/                    # File upload directory
├── package.json
├── tsconfig.json
├── jest.config.js              # Jest testing configuration
├── GITHUB_ACTIONS_SETUP.md     # CI/CD setup guide
└── .env.example
```

## Data Model (ERD)

Single-table schema (`users`) used for auth, feature usage, and rate limits:

```text
users
├─ id (serial, PK)
├─ name (varchar, not null)
├─ email (varchar, unique, not null)
├─ company_name (varchar, not null)
├─ password (varchar, hashed, not null)
├─ refreshToken (varchar, nullable)
├─ filesUploaded (integer, not null, default 0)
├─ batch_analysis (integer, not null, default 0)
├─ compare_resumes (integer, not null, default 0)
├─ selected_candidate (integer, not null, default 0)  ← used for candidate selection rate limit
├─ emailVerified (boolean, not null, default false)
├─ verificationToken (varchar, nullable)
├─ verificationExpires (timestamp, nullable)
├─ resetToken (varchar, nullable)
├─ resetTokenExpires (timestamp, nullable)
├─ created_at (timestamp, default now)
└─ updated_at (timestamp, default now)
```

Key relationships/usage:

- Tokens: `verificationToken`/`verificationExpires` for email verification; `resetToken`/`resetTokenExpires` for password reset; `refreshToken` for JWT refresh.
- Rate limits & counters: `filesUploaded`, `batch_analysis`, `compare_resumes`, `selected_candidate` (10 max for selected_candidate per instructions).

## Environment Setup

### 1. Clone and Install

```bash
git clone
cd hiredesk_backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-minimum-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-chars

# JWT Expiration (optional - defaults provided)
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.vercel.app

# Email Configuration (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hiredesk.com
FRONTEND_URL=http://localhost:3000
VERIFICATION_EXPIRY=86400000
```

### 4. Email Setup (for Email Verification)

The application includes email verification for new user registrations. Configure SMTP settings:

#### Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
3. **Configure Environment Variables**:

   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   EMAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=http://localhost:3000
   ```

#### Other Email Providers

- **Outlook/Hotmail**: `SMTP_HOST=smtp-mail.outlook.com`
- **Yahoo**: `SMTP_HOST=smtp.mail.yahoo.com`
- **Custom SMTP**: Use your provider's SMTP settings

#### Testing Email Configuration

```bash
# Test email connection (add this to your code temporarily)
import { testEmailConnection } from './src/services/emailService';
testEmailConnection().then(result => console.log('Email test:', result));
```

### 5. NeonDB Setup

```bash
# Create a NeonDB account at https://neon.tech
# Create a new project and copy the connection string
# Update DATABASE_URL in your .env file with the NeonDB connection string
```

### 4. Generate JWT Secrets

```bash
# Generate secure random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start Development Server

```bash
npm run dev
```

## Authentication System

### Token Flow

1. **Registration/Login**: Returns access token + sets HttpOnly refresh cookie
2. **API Requests**: Include access token in Authorization header
3. **Token Refresh**: Automatic refresh using refresh cookie
4. **Logout**: Clears cookie and removes server token

### API Endpoints

#### Authentication Endpoints

##### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "company_name": "ABC Corporation"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "company_name": "ABC Corporation",
      "filesUploaded": 0
    }
  }
}
```

**Cookies Set:**

- `refreshToken`: HttpOnly cookie containing refresh token

##### POST /api/auth/login

Authenticate user credentials.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as registration (access token + user data)

##### POST /api/auth/refresh

Refresh access token using refresh cookie.

**Request:** No body required (uses refresh cookie)

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token_here",
    "user": {
      /* user data */
    }
  }
}
```

##### POST /api/auth/logout

Secure logout - clears refresh token.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

##### POST /api/auth/reset-password

Reset user password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "newPassword": "NewSecurePass123!"
}
```

##### GET /api/auth/profile

Get authenticated user profile.

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "company_name": "ABC Corporation",
    "filesUploaded": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

##### POST /api/auth/change-password

Change user password (requires current password verification).

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "currentPassword": "CurrentSecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Validation Rules:**

- All fields are required
- New password must be at least 8 characters long
- New password and confirm password must match
- Current password must be correct

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

```json
// Invalid current password
{
  "success": false,
  "message": "Invalid current password",
  "error": "Current password is incorrect"
}

// Password mismatch
{
  "success": false,
  "message": "Validation error",
  "error": "New password and confirm password do not match"
}

// Weak password
{
  "success": false,
  "message": "Validation error",
  "error": "New password must be at least 8 characters long"
}
```

#### File Count Endpoints

##### POST /api/files/count

Count a file (authenticated users only). Files are processed but not stored.

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**

```text
file: <uploaded_file>
```

**Supported File Types:**

- PDF (.pdf)
- Word documents (.doc, .docx)
- Text files (.txt)
- Images (.jpg, .png, .gif)

**Response:**

```json
{
  "success": true,
  "message": "File counted successfully",
  "data": {
    "originalName": "resume.pdf",
    "size": 1024000,
    "totalFilesUploaded": 6
  }
}
```

##### GET /api/files/stats

Get user's file count statistics.

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response:**

````json
{
  "success": true,
  "message": "Upload stats retrieved successfully",
  "data": {
    "totalFilesUploaded": 6,
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}


## Testing

### Backend Testing

#### Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "company_name": "Test Company"
  }' \
  -c cookies.txt
````

#### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }' \
  -c cookies.txt
```

#### Test Protected Endpoint

```bash
# Extract access token from previous response
ACCESS_TOKEN="your_access_token_here"

curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

#### Test Token Refresh

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt
```

### Frontend Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm start`
3. Test registration, login, file upload, and logout flows
4. Verify automatic token refresh works
5. Test with expired tokens

## Security Considerations

### Production Deployment

1. **HTTPS Only**: Set `NODE_ENV=production` and use HTTPS
2. **Strong Secrets**: Use cryptographically secure random strings (minimum 32 characters)
3. **Environment Variables**: Never commit `.env` file to version control
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Input Validation**: Validate all user inputs on both frontend and backend
6. **File Upload Security**: Scan uploaded files for malware in production

### Cookie Security

- HttpOnly: Prevents XSS access to refresh tokens
- SameSite=Strict: Prevents CSRF attacks
- Secure: HTTPS only in production
- Path restricted: `/api/auth` only

### Token Security

- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Hashed in database, auto-expiring
- Token rotation: New refresh token on each use
- Secure logout: Server-side token invalidation

## Production Deployment

### Environment Setup

```bash
NODE_ENV=production
JWT_ACCESS_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<different-strong-random-string>
DATABASE_URL=<production-neondb-connection-string>
```

### Process Management

```bash
# Using PM2
npm install -g pm2
pm2 start dist/index.js --name hiredesk-api
pm2 startup
pm2 save
```

### Nginx Configuration (example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Testing

### Test Framework

The project uses **Jest** with comprehensive test coverage:

- **Test Suites**: 6 test suites covering all components
- **Total Tests**: 37 tests (all passing)
- **Coverage**: Comprehensive coverage for utils, middleware, controllers
- **Test Types**: Unit, Integration, and End-to-End tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=auth.test.ts
```

### Test Structure

```text
tests/
├── utils/
│   ├── auth.test.ts           # JWT & password utilities
│   └── helpers.test.ts        # Test helper functions
├── middleware/
│   └── auth.test.ts           # Authentication middleware
├── controllers/
│   ├── authController.test.ts # Auth endpoint logic
│   └── fileController.test.ts # File processing logic
├── integration/
│   └── auth.test.ts           # Full API integration tests
└── e2e/
    └── auth.test.ts           # End-to-end authentication flow
```

### Test Features

- **Database Mocking**: Uses in-memory database for isolated testing
- **API Testing**: Supertest for HTTP endpoint testing
- **Security Testing**: Password hashing and JWT validation
- **Error Handling**: Comprehensive error scenario coverage
- **Performance Testing**: Response time validation

## Phase 4: Performance & Production Readiness

### Overview

Phase 4 adds enterprise-grade performance testing, monitoring, and deployment validation capabilities to ensure production readiness:

- **Load Testing**: Artillery-based testing for authentication, rate limiting, and mixed workloads
- **Performance Monitoring**: Real-time system resource tracking during testing
- **Health Checks**: Automated endpoint validation and service health monitoring
- **Deployment Validation**: Comprehensive pre-deployment security and configuration checks
- **CI/CD Integration**: Automated performance validation in deployment pipelines

### Performance Testing Suite

#### Load Testing Scenarios

```bash
# Authentication load testing (gradual ramp-up to peak load)
npm run loadtest:auth

# Rate limiting under concurrent load
npm run loadtest:rate-limit

# Mixed realistic workload patterns
npm run loadtest:mixed

# Extreme stress testing
npm run loadtest:stress

# Generate comprehensive reports
npm run loadtest:report
```

#### Performance Monitoring

```bash
# Run comprehensive performance benchmark
npm run perf:benchmark

# Monitor system resources during testing
npm run perf:monitor

# Validate deployment readiness
npm run validate:deployment
```
