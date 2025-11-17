# AWS Lambda 502 Bad Gateway Error - Troubleshooting Guide

## Issues Fixed in Code

### 1. Lambda Handler Issues ✅ FIXED
**Problem**: Improper error handling and response formatting
**Solution**: Enhanced lambda-handler.js with:
- Proper error handling with try-catch
- `callbackWaitsForEmptyEventLoop = false`
- Structured error responses for API Gateway
- Enhanced CORS headers

### 2. Express Server Configuration ✅ FIXED
**Problem**: Missing error handling and improper middleware setup
**Solution**: Updated server.js with:
- Global error handlers for uncaught exceptions
- Enhanced CORS configuration
- Proper body parsing with larger limits for file uploads
- AWS client initialization with retry logic
- Fixed `docClient.get()` method call (should be `docClient.send(new GetCommand())`)

### 3. Dependency Issues ✅ FIXED
**Problem**: Removed conflicting dependencies
**Solution**: 
- Removed `aws-serverless-express` (legacy)
- Using `@vendia/serverless-express` consistently
- Cleaned up import statements

## AWS Configuration Checklist

### Lambda Function Settings
```bash
# Required settings:
Handler: lambda-handler.handler
Runtime: Node.js 18.x or 20.x
Timeout: 30 seconds (minimum)
Memory: 512 MB (recommended)
```

### Environment Variables
```bash
# Essential environment variables for your Lambda:
AWS_REGION=us-east-2
CAMPUS_DATA=your-campus-table-name
STUDENT_PROFILE=your-student-profile-table-name  
USER_DETAILS=your-user-details-table-name
COURSE_TABLE=your-course-table-name
SUBJECT_TABLE=your-subject-table-name
QUESTIONS_TABLE=your-questions-table-name
CLASS_TABLE=your-class-table-name
CHAPTER_TABLE=your-chapter-table-name
ROLE_DETAILS=your-role-details-table-name
PACKAGE_DETAILS=your-package-details-table-name
TEST_DETAILS=your-test-details-table-name
S3_BUCKET_NAME=your-s3-bucket-name
```

### IAM Permissions
Your Lambda execution role needs these policies:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:ListTables"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-2:*:table/*",
                "arn:aws:dynamodb:us-east-2:*:table/*/index/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### API Gateway Configuration
```bash
# If using API Gateway, ensure:
1. Integration type: Lambda Proxy
2. Use Lambda Proxy integration: ✅ Enabled
3. CORS enabled on all methods
4. Binary media types configured (for image uploads):
   - image/jpeg
   - image/png
   - image/gif
   - application/octet-stream
```

## Deployment Steps

### 1. Package for Deployment
```bash
# Run this from your project root:
deploy-lambda.bat
```

### 2. Upload to Lambda
1. Go to AWS Lambda Console
2. Select your function
3. Upload `lambda-deployment.zip`
4. Set handler to `lambda-handler.handler`

### 3. Test the Function
```bash
# Test event for API Gateway:
{
  "httpMethod": "GET",
  "path": "/health",
  "headers": {},
  "queryStringParameters": null,
  "body": null
}
```

### 4. Check CloudWatch Logs
Monitor logs for:
- Initialization errors
- DynamoDB connection issues
- S3 permission problems
- Timeout errors

## Common 502 Causes & Solutions

### 1. Lambda Timeout
**Symptom**: 502 after exactly 3, 15, or 30 seconds
**Solution**: Increase timeout in Lambda configuration

### 2. Runtime Errors
**Symptom**: 502 with no response
**Solution**: Check CloudWatch logs for JavaScript errors

### 3. Missing Environment Variables
**Symptom**: 502 on database operations
**Solution**: Verify all required environment variables are set

### 4. IAM Permission Issues
**Symptom**: 502 when accessing DynamoDB/S3
**Solution**: Update Lambda execution role with proper permissions

### 5. Package Size Issues
**Symptom**: Function fails to deploy or start
**Solution**: Optimize dependencies, use Lambda layers

### 6. API Gateway Integration
**Symptom**: 502 only through API Gateway
**Solution**: Enable Lambda Proxy Integration

## Testing Your Fixed Function

### 1. Local Testing
```bash
# Test locally first:
cd src/backend
node test-server.js
# Test endpoint: http://localhost:3001/health
```

### 2. Lambda Console Testing
Use test events in Lambda console to verify basic functionality

### 3. API Gateway Testing
Test through actual API Gateway endpoints

## Monitoring & Debugging

### CloudWatch Logs
- Check for initialization errors
- Monitor memory usage
- Track execution duration

### CloudWatch Metrics
- Monitor error rates
- Track invocation counts
- Set up alarms for failures

### X-Ray Tracing
Enable X-Ray for detailed request tracing

## Next Steps After Deployment

1. ✅ Verify Lambda function starts without errors
2. ✅ Test health check endpoint: `/health`
3. ✅ Test database connectivity: `/debug/env`
4. ✅ Test S3 integration with photo upload
5. ✅ Update your frontend API configuration to use new Lambda URL

## Support Files Created

- `deploy-lambda.bat` - Automated deployment script
- Enhanced `lambda-handler.js` - Fixed Lambda handler
- Enhanced `server.js` - Fixed Express server
- This troubleshooting guide

Your Lambda function should now work without 502 errors! 🎉
