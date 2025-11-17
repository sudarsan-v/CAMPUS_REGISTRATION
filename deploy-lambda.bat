@echo off
echo Starting Lambda deployment process...

REM Navigate to backend directory
cd src\backend

echo.
echo Installing dependencies...
call npm install

echo.
echo Creating deployment package...
if exist lambda-deployment.zip del lambda-deployment.zip

REM Copy utils if it exists outside backend
if exist "..\..\utils" (
    echo Copying shared utils folder...
    xcopy "..\..\utils" "utils\" /E /I /Y > nul
)

REM Create zip with all necessary files (including utils if copied)
if exist utils (
    powershell -Command "Compress-Archive -Path *.js, package.json, node_modules, utils -DestinationPath lambda-deployment.zip -Force"
) else (
    powershell -Command "Compress-Archive -Path *.js, package.json, node_modules -DestinationPath lambda-deployment.zip -Force"
)

REM Clean up copied utils folder
if exist utils rmdir /s /q utils

echo.
echo Deployment package created: lambda-deployment.zip

echo.
echo ========================================
echo Lambda deployment package ready!
echo ========================================
echo.
echo Next steps:
echo 1. Upload lambda-deployment.zip to your Lambda function
echo 2. Set the handler to: lambda-handler.handler
echo 3. Configure environment variables:
echo    - AWS_REGION=us-east-2
echo    - STUDENT_PROFILE=your-student-profile-table-name
echo    - USER_DETAILS=your-user-details-table-name
echo    - CAMPUS_DATA=your-campus-data-table-name
echo    - COURSE_TABLE=your-course-table-name
echo    - SUBJECT_TABLE=your-subject-table-name
echo    - QUESTIONS_TABLE=your-questions-table-name
echo    - CLASS_TABLE=your-class-table-name
echo    - CHAPTER_TABLE=your-chapter-table-name
echo    - PACKAGE_DETAILS=your-package-details-table-name
echo    - TEST_DETAILS=your-test-details-table-name
echo    - S3_BUCKET_NAME=your-s3-bucket-name
echo 4. Set timeout to at least 30 seconds
echo 5. Set memory to at least 512 MB
echo 6. Ensure Lambda has proper IAM permissions for DynamoDB and S3
echo.
echo DEBUGGING ENDPOINTS ADDED:
echo - GET /debug/env - Check environment and DynamoDB connectivity
echo - POST /test/profile-save - Test profile save functionality
echo - GET /health - Basic health check
echo.
echo After deployment, test these endpoints to debug any issues!
echo.

pause
