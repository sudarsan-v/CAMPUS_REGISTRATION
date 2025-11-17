# Lambda Profile API Debugging Guide

## Issue: API returns 200 but data not saving to DynamoDB

### Fixed Issues in Code:
1. ✅ Removed duplicate CORS/JSON middleware
2. ✅ Enhanced error handling and validation
3. ✅ Added environment variable validation
4. ✅ Added DynamoDB client validation
5. ✅ Added save verification
6. ✅ Enhanced debugging endpoints

### Debugging Steps:

#### 1. Test Environment Configuration
```bash
# Test this endpoint first:
GET https://your-lambda-url/debug/env
```

**Expected Response:**
```json
{
  "success": true,
  "environment": {
    "STUDENT_PROFILE": "your-table-name",
    "AWS_REGION": "us-east-2",
    "...": "..."
  },
  "dynamodb_status": "connected",
  "available_tables": ["table1", "table2", "..."],
  "missing_tables": [],
  "client_initialized": true
}
```

**If missing_tables is not empty:** Set correct environment variables in Lambda.

#### 2. Test Profile Save Functionality
```bash
# Test this endpoint:
POST https://your-lambda-url/test/profile-save
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test profile save successful",
  "put_result": {...},
  "verification_result": {...},
  "saved_item": {...}
}
```

#### 3. Test Actual Profile Save
```bash
# Test with your actual data:
POST https://your-lambda-url/institute/student/home/profile
Content-Type: application/json

{
  "student_id": 123,
  "student_firstname": "John",
  "student_lastname": "Doe",
  "email": "john@example.com",
  "mobile_number": "1234567890",
  "gender": "Male"
}
```

**Enhanced Response will include:**
```json
{
  "success": true,
  "message": "Profile saved successfully for student_id: 123",
  "profile": {...}  // Verification data
}
```

### Environment Variables Required:

Set these in your Lambda function:

```bash
# Required for profile functionality
STUDENT_PROFILE=YourStudentProfileTableName
USER_DETAILS=YourUserDetailsTableName
CAMPUS_DATA=YourCampusDataTableName

# Required for other features
COURSE_TABLE=YourCourseTableName
SUBJECT_TABLE=YourSubjectTableName
QUESTIONS_TABLE=YourQuestionsTableName
CLASS_TABLE=YourClassTableName
CHAPTER_TABLE=YourChapterTableName
PACKAGE_DETAILS=YourPackageDetailsTableName
TEST_DETAILS=YourTestDetailsTableName

# Required for S3 photo storage
S3_BUCKET_NAME=your-s3-bucket-name

# AWS Configuration
AWS_REGION=us-east-2
```

### IAM Permissions Required:

Your Lambda execution role needs these policies:

```json
{
    "Version": "2012-10-17",
    "Statement": [
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
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

### Common Issues & Solutions:

#### Issue 1: "Table not found"
**Solution:** Check environment variables and table names

#### Issue 2: "Access denied" 
**Solution:** Update Lambda execution role IAM permissions

#### Issue 3: "Validation error"
**Solution:** Check DynamoDB table schema and data types

#### Issue 4: 200 response but no save
**Solution:** Check CloudWatch logs for detailed error messages

### CloudWatch Logs to Monitor:

Look for these log entries:
- `=== PROFILE SAVE API CALLED ===`
- `DynamoDB PutCommand params:`
- `DynamoDB put result:`
- `✅ Profile save verified successfully!`
- Any error messages with stack traces

### Quick Fix Checklist:

1. ✅ Environment variables set correctly
2. ✅ Lambda has DynamoDB permissions
3. ✅ Table names match exactly (case-sensitive)
4. ✅ Lambda timeout set to 30+ seconds
5. ✅ Memory set to 512+ MB
6. ✅ Latest deployment package uploaded

### Next Steps:

1. Deploy the updated code
2. Test `/debug/env` endpoint
3. Test `/test/profile-save` endpoint
4. Check CloudWatch logs for detailed error messages
5. Test actual profile save with your data

The enhanced error handling will now provide much more detailed information about what's failing!
