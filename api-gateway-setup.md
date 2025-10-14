# API Gateway Setup Instructions

## Problem
The endpoint `/institute/student/home/profile` is returning 403 "Missing Authentication Token" because the route doesn't exist in AWS API Gateway.

## Current Working Routes
- `/institute/packages` ✅ (Working)
- `/api/login` ✅ (Working)
- `/api/changepassword` ✅ (Working)

## Missing Routes (Need to be Added)
- `/institute/student/home/profile` ❌ (403 Error)
- `/institute/student/home/getprofile` ❌ (403 Error)
- `/institute/student/home/photo/{student_id}` ❌ (403 Error)

## Solution: Add Missing Routes to API Gateway

### Step 1: Access AWS API Gateway Console
1. Go to AWS Console → API Gateway
2. Find your API: `j0x67zhvpb`

### Step 2: Add Missing Routes
1. Click on your API `j0x67zhvpb`
2. Under Resources, you should see `/institute/packages`
3. Create the following resource structure:

```
/institute
  └── /student
      └── /home
          ├── /profile (POST, OPTIONS)
          ├── /getprofile (GET, OPTIONS)
          └── /photo
              └── /{student_id} (GET, OPTIONS)
```

### Step 3: Configure Each Route
For each route:
1. Click "Create Resource"
2. Set resource name and path
3. Click "Create Method" 
4. Select HTTP method (GET/POST)
5. Choose "Lambda Function" integration
6. Select your Lambda function
7. Enable CORS if needed

### Step 4: Deploy API
1. Click "Actions" → "Deploy API"
2. Select deployment stage (probably "dev")
3. Click "Deploy"

### Step 5: Test
Test the endpoints:
- POST `https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/institute/student/home/profile`
- GET `https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/institute/student/home/getprofile`

## Environment Variables to Set in Lambda
Make sure these are set in your Lambda function:
- `S3_BUCKET_NAME`: Name of your S3 bucket for photos
- `STUDENT_PROFILE`: DynamoDB table name
- `AWS_REGION`: us-east-2

## S3 Bucket Setup
1. Create S3 bucket named `campus-registration-photos` (or update S3_BUCKET_NAME env var)
2. Ensure Lambda has permissions to read/write to this bucket
3. Configure bucket for private access (photos will use signed URLs)

## IAM Permissions Required
Your Lambda execution role needs:
- DynamoDB: GetItem, PutItem, Scan, Query
- S3: GetObject, PutObject, DeleteObject
- S3: GetObjectVersion (for signed URLs)
