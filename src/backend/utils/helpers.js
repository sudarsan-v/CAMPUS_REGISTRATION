// Backend utility functions for AWS Lambda

// Database helper functions
export const validateDynamoDBParams = (params) => {
  if (!params.TableName || params.TableName === 'undefined' || params.TableName === 'null') {
    throw new Error(`Invalid table name: ${params.TableName}`);
  }
  return true;
};

// Error handling utilities
export const handleDynamoDBError = (error, operation) => {
  console.error(`DynamoDB ${operation} error:`, error);
  
  if (error.name === 'ResourceNotFoundException') {
    return { status: 404, message: 'Resource not found' };
  } else if (error.name === 'ValidationException') {
    return { status: 400, message: 'Invalid input: ' + error.message };
  } else if (error.name === 'AccessDeniedException') {
    return { status: 403, message: 'Access denied' };
  } else {
    return { status: 500, message: 'Internal server error' };
  }
};

// S3 utilities
export const generateS3Key = (userId, fileType = 'photo') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${fileType}s/user_${userId}_${timestamp}.jpg`;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

// Environment validation
export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'USER_DETAILS',
    'STUDENT_PROFILE',
    'CAMPUS_TABLE',
    'AWS_REGION'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
};
