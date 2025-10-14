const express = require('express');
const cors = require('cors');

// Simple test server to verify profile endpoint works
const app = express();
app.use(cors());
app.use(express.json());

// Mock environment variables for testing
process.env.STUDENT_PROFILE = 'test-student-profile';
process.env.S3_BUCKET_NAME = 'test-bucket';

app.post('/institute/student/home/profile', (req, res) => {
  console.log('TEST: Profile endpoint called');
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'Profile endpoint is working! Now needs to be added to API Gateway.',
    received_data: req.body
  });
});

app.get('/institute/student/home/getprofile', (req, res) => {
  console.log('TEST: Get profile endpoint called');
  console.log('Query:', req.query);
  
  res.json({
    success: true,
    message: 'Get profile endpoint is working!',
    profile: {
      student_id: req.query.student_id,
      student_firstname: 'Test',
      student_lastname: 'User',
      email: 'test@example.com'
    }
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test the endpoints:');
  console.log(`POST http://localhost:${PORT}/institute/student/home/profile`);
  console.log(`GET http://localhost:${PORT}/institute/student/home/getprofile?student_id=1`);
});
