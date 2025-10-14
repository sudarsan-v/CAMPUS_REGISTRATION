require('dotenv').config();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
const fs = require('fs');
const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { DynamoDBClient, ListTablesCommand} = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
//const jwt = require('jsonwebtoken');

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-2',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
});

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
});

const docClient = DynamoDBDocumentClient.from(client);
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const captchas = new Map();
// Define table names (set via environment variables in Lambda)
const CAMPUS_TABLE = process.env.CAMPUS_TABLE;
const COURSE_TABLE = process.env.COURSE_TABLE;
const SUBJECT_TABLE = process.env.SUBJECT_TABLE;
const CAMPUS_DATA = process.env.DYNAMODB_TABLE_NAME;
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE;
const CLASS_TABLE = process.env.CLASS_TABLE;
const CHAPTER_TABLE = process.env.CHAPTER_TABLE;
const ROLE_DETAILS = process.env.ROLE_DETAILS;
const USER_DETAILS = process.env.USER_DETAILS;
const STUDENT_PROFILE = process.env.STUDENT_PROFILE;
const PACKAGE_DETAILS = process.env.PACKAGE_DETAILS;
const TEST_DETAILS = process.env.TEST_DETAILS;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'campus-registration-photos';

// Initialize Express app
const app = express();
//const app = require('./server');
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Campus Selection API');
});

// Helper functions for S3 operations
const uploadPhotoToS3 = async (base64Data, studentId) => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Generate unique filename
    const fileName = `student-photos/${studentId}-${Date.now()}.jpg`;
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'private'
    });
    
    await s3Client.send(command);
    return fileName;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

const getPhotoUrlFromS3 = async (fileName) => {
  try {
    if (!fileName) return null;
    
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
    });
    
    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Error getting S3 URL:', error);
    return null;
  }
};

const deletePhotoFromS3 = async (fileName) => {
  try {
    if (!fileName) return;
    
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    // Don't throw error as this is cleanup
  }
};

// const session = require('express-session');
// app.use(session({
//   secret: 'IeSxpPhhHTwKtDsbCyvsZ5pUULl7XgaNhNiLPhOV',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true } // set to true in production with HTTPS
// }));
// req.session.userId = user.user_id;


app.get('/api/campus', async (req, res) => {
  const { showHidden } = req.query;
  const params = { TableName: CAMPUS_DATA };
  let FilterExpression = '';
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};
  if (!showHidden || showHidden === 'false') {
    FilterExpression = 'attribute_not_exists(#hidden) OR #hidden = :false';
    ExpressionAttributeNames['#hidden'] = 'hidden';
    ExpressionAttributeValues[':false'] = false;
  }
  if (FilterExpression) params.FilterExpression = FilterExpression;
  if (Object.keys(ExpressionAttributeNames).length) params.ExpressionAttributeNames = ExpressionAttributeNames;
  if (Object.keys(ExpressionAttributeValues).length) params.ExpressionAttributeValues = ExpressionAttributeValues;
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
});

// Search campuses (with optional showHidden param)
app.get('/api/campus/search', async (req, res) => {
  const { search, showHidden } = req.query;
  if (!search) {
    return res.status(400).json({ success: false, message: 'Search term is required' });
  }
  const params = { TableName: CAMPUS_DATA };
  let FilterExpression = 'contains(#campus, :search) OR contains(#name, :search) OR contains(#mobile, :search) OR contains(#email, :search) OR contains(#location, :search) OR contains(#displayName, :search)';
  let ExpressionAttributeNames = {
    '#campus': 'campus',
    '#name': 'name',
    '#mobile': 'mobile',
    '#email': 'email',
    '#location': 'location',
    '#displayName': 'displayName'
  };
  let ExpressionAttributeValues = { ':search': search };
  if (!showHidden || showHidden === 'false') {
    FilterExpression += ' AND (attribute_not_exists(#hidden) OR #hidden = :false)';
    ExpressionAttributeNames['#hidden'] = 'hidden';
    ExpressionAttributeValues[':false'] = false;
  }
  params.FilterExpression = FilterExpression;
  params.ExpressionAttributeNames = ExpressionAttributeNames;
  params.ExpressionAttributeValues = ExpressionAttributeValues;
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (error) {
    console.error('Error searching data:', error);
    res.status(500).json({ success: false, message: 'Failed to search data' });
  }
});

// Fetch single campus by ID (for edit)
app.get('/api/editcampus/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }
  const params = {
    TableName: CAMPUS_DATA,
    Key: { id: Number(id) }
  };
  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (!Item) {
      return res.status(404).json({ success: false, message: 'Campus not found' });
    }
    res.json(Item);
  } catch (error) {
    console.error('Error fetching campus:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch campus' });
  }
});

// Add campus
app.post('/api/addcampus', async (req, res) => {
  const { campus, name, mobile, email, location, displayName } = req.body;

  if (!campus || !name || !mobile || !email || !location || !displayName) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const params = {
    TableName: CAMPUS_DATA,
    Item: {
      id: Date.now(),
      campus,
      name,
      mobile,
      email,
      location,
      displayName,
      hidden: false
    }
  };

  try {
    await docClient.send(new PutCommand(params));
    res.json({ success: true, message: 'Campus added successfully' });
  } catch (error) {
    console.error('Error adding campus:', error);
    res.status(500).json({ success: false, message: 'Failed to add campus' });
  }
});

// Update campus (partial updates supported)
app.put('/api/editcampus/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  const fields = req.body;
  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  let updateExpression = 'set ';
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let first = true;
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) {
      if (!first) updateExpression += ', ';
      updateExpression += `#${key} = :${key}`;
      ExpressionAttributeNames[`#${key}`] = key;
      ExpressionAttributeValues[`:${key}`] = value;
      first = false;
    }
  });

  const params = {
    TableName: CAMPUS_DATA,
    Key: { id: Number(id) },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await docClient.send(new UpdateCommand(params));
    res.json({ success: true, message: 'Campus updated successfully' });
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({ success: false, message: 'Failed to update campus' });
  }
});

// Fetch all campuses (from /campuses)
app.get('/campuses', async (req, res) => {
  console.log('DynamoDBClient loaded:', typeof DynamoDBClient === 'function');
  console.log('Attempting to scan table:', CAMPUS_TABLE);
  const params = { TableName: CAMPUS_TABLE };
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    console.log('Fetched campuses:', Items);
    res.json(Items);
  } catch (error) {
    console.error('Error fetching campuses:', error);
    try {
      const { TableNames } = await docClient.send(new ListTablesCommand({}));
      console.log('Available tables:', TableNames);
    } catch (listError) {
      console.error('Failed to list tables:', listError);
    }
    res.status(500).json({ success: false, message: 'Failed to fetch campuses' });
  }
});


app.get('/list-tables', async (req, res) => {
  try {
    const command = new ListTablesCommand({});
    const data = await client.send(command);
    res.json({ success: true, data: data.TableNames });
  } catch (error) {
    console.error('Failed to list tables:', error);
    res.status(500).json({ success: false, message: 'Failed to list tables' });
  }
});

// Debug endpoint to check environment variables and table status
app.get('/debug/env', (req, res) => {
  console.log('=== DEBUG ENVIRONMENT ===');
  const envVars = {
    STUDENT_PROFILE: STUDENT_PROFILE,
    USER_DETAILS: USER_DETAILS,
    CAMPUS_DATA: CAMPUS_DATA,
    AWS_REGION: process.env.AWS_REGION || 'us-east-2'
  };
  console.log('Environment variables:', envVars);
  res.json({ success: true, environment: envVars });
});

// Fetch courses by campus_id
app.get('/courses', async (req, res) => {
  const { campus_id } = req.query;
  console.log('Fetching courses for campus_id:', campus_id);
  if (!campus_id) {
    return res.status(400).json({ success: false, message: 'campus_id is required' });
  }
  const parsedCampusId = Number(campus_id);
  if (isNaN(parsedCampusId)) {
    return res.status(400).json({ success: false, message: 'campus_id must be a valid number' });
  }
  console.log('Using table:', COURSE_TABLE, 'with index:', 'campusId-index');
  const params = {
    TableName: COURSE_TABLE,
    IndexName: 'campusId-index',
    KeyConditionExpression: 'campus_id = :campus_id',
    ExpressionAttributeValues: { ':campus_id': parsedCampusId }
  };
  try {
    const { Items } = await docClient.send(new QueryCommand(params));
    console.log('Fetched courses:', Items);
    res.json(Items);
  } catch (error) {
    console.error('Error fetching courses:', error);
    if (error.name === 'ValidationException' && error.message.includes('backfilling')) {
      console.log('Index campusId-index is still backfilling. Please wait until it is ACTIVE.');
      res.status(503).json({ success: false, message: 'Index is backfilling. Please try again later.' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
  }
});

// Fetch subjects by course_id
app.get('/subjects', async (req, res) => {
  const { course_id } = req.query;
  console.log('Fetching subjects for course_id:', course_id);
  if (!course_id) {
    return res.status(400).json({ success: false, message: 'course_id is required' });
  }
  const parsedCourseId = Number(course_id);
  if (isNaN(parsedCourseId)) {
    return res.status(400).json({ success: false, message: 'course_id must be a valid number' });
  }
  console.log('Using table:', SUBJECT_TABLE, 'with index:', 'courseId-index');
  const params = {
    TableName: SUBJECT_TABLE,
    IndexName: 'courseId-index',
    KeyConditionExpression: 'course_id = :course_id',
    ExpressionAttributeValues: { ':course_id': parsedCourseId }
  };
  try {
    const { Items } = await docClient.send(new QueryCommand(params));
    console.log('Fetched subjects:', Items);
    res.json(Items);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password, captcha } = req.body;
  if (!username || !password || !captcha) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const userIp = req.ip;
  const storedCaptcha = captchas.get(userIp);
  if (!storedCaptcha || storedCaptcha.expires < Date.now() || captcha !== storedCaptcha.value) {
    return res.status(401).json({ success: false, message: 'Invalid or expired CAPTCHA.' });
  }
  captchas.delete(userIp);

  try {
    console.log('USER_DETAILS table:', USER_DETAILS);
    console.log('Looking up user:', username);

    // Scan for the username
    const params = {
      TableName: USER_DETAILS,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username }
    };
    const { Items } = await docClient.send(new ScanCommand(params));
    const user = Items && Items[0];

    console.log('DynamoDB returned:', user);

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    // For demo: compare plain text password
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
    //const userId = req.session.userId;
    // After finding user
    //req.session.userId = user.userid; // Set session userId
    // Generate JWT token (optional)
    // const token = jwt.sign({ userId: user.user_id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      role: user.role_id,
      user: {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
        // Add any other user fields you want to store in sessionStorage
        name: user.name || user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.post('/api/changepassword', async (req, res) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!username || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New password and confirm password do not match.' });
  }

  try {
    // Fetch user by username
    let queryParams = {
      TableName: USER_DETAILS,
      IndexName: 'username-index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username }
    };
    let { Items } = await docClient.send(new QueryCommand(queryParams));

    // Fallback to scan if query fails
    if (!Items || !Items.length) {
      console.log('Query failed, falling back to scan for username:', username);
      const scanParams = {
        TableName: USER_DETAILS,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: { ':username': username }
      };
      const scanResult = await docClient.send(new ScanCommand(scanParams));
      Items = scanResult.Items || [];
    }

    if (!Items.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const Item = Items[0];

    // Compare old password with hashed password
    const isMatch = await bcrypt.compare(oldPassword, Item.password);
    console.log('Comparing:', { oldPassword, storedHash: Item.password, isMatch });
    if (!(!isMatch)) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect.' });
    }

    // Hash the new password
    //const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedPassword = newPassword;
    // Update the password in the table
    const updateParams = {
      TableName: USER_DETAILS,
      Key: { user_id: Item.user_id },
      UpdateExpression: 'set password = :newPassword',
      ExpressionAttributeValues: {
        ':newPassword': hashedPassword
      },
      ReturnValues: 'UPDATED_NEW'
    };
    await docClient.send(new UpdateCommand(updateParams));

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    console.error('Error changing password:', error.message || error);
    if (error.name === 'ResourceNotFoundException') {
      return res.status(404).json({ success: false, message: 'Table not found.' });
    } else if (error.name === 'AccessDeniedException') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions to access the table.' });
    } else if (error.name === 'ValidationException') {
      return res.status(400).json({ success: false, message: 'Invalid input: ' + error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});


app.get('/api/captcha', (req, res) => {
  const captchaValue = crypto.randomBytes(4).toString('hex').toUpperCase();  
  const userIp = req.ip; 
  captchas.set(userIp, { value: captchaValue, expires: Date.now() + 60000 });  
  res.json({ captcha: captchaValue });  
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful!' });
});

app.get('/api/questions', async (req, res) => {
  const params = { TableName: QUESTIONS_TABLE };
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items.map(item => ({ value: item.id, label: item.questionText }))); // Format for dropdown
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
});

// New endpoint for dynamic question change
app.post('/question/change/', (req, res) => {
  const { courseid, classid, subjectid, type } = req.body;

  if (!courseid || !classid || !type) {
    return res.status(400).json({ success: false, message: 'courseid, classid, and type are required' });
  }

  const courseId = Number(courseid);
  const classId = Number(classid);
  const subjectId = subjectid ? Number(subjectid) : null;

  if (isNaN(courseId) || isNaN(classId) || (subjectId !== null && isNaN(subjectId))) {
    return res.status(400).json({ success: false, message: 'IDs must be valid numbers' });
  }

  // Mock responses based on type
  if (type === 'getsubjects') {
    res.json({
      sublist: [
        { id: 3, name: 'CHEMISTRY' },
        { id: 2, name: 'PHYSICS' },
        { id: 1, name: 'MATHS' }
      ]
    });
  } else if (type === 'getmaintopics') {
    if (!subjectid) {
      return res.status(400).json({ success: false, message: 'subjectid is required for getmaintopics' });
    }
    const response = subjectId === 2 ? {
      maintopiclist: [
        { id: 781, name: 'MAGNETIC EFFECTS OF CURRENT AND MAGNETISM' },
        { id: 280, name: 'WAVE OPTICS' },
        { id: 193, name: 'OPTICS' },
        { id: 785, name: 'ELECTRONIC DEVICES' },
        { id: 784, name: 'ATOMS AND NUCLEI' },
        { id: 270, name: 'DUAL NATURE OF RADIATION AND MATTER' },
        { id: 267, name: 'ATOMS' },
        { id: 276, name: 'MAGNETISM AND MATTER' },
        { id: 272, name: 'ELECTRO MAGNETIC INDUCTION' },
        { id: 278, name: 'NUCLEI' },
        { id: 159, name: 'PHYSICS-JEE MAIN-AS-GT1' },
        { id: 888, name: 'SEMICONDUCTOR ELECTRONICS:MATERIALS, DEVICES,SIMPLE CIRCUITS' },
        { id: 266, name: 'ALTERNATING CURRENT' },
        { id: 419, name: 'ELECTRO MAGNETIC WAVES' },
        { id: 271, name: 'ELECTRIC CHARGES AND FIELDS' },
        { id: 6, name: 'MEASUREMENT, WPM, GEN.PHYSICS' },
        { id: 703, name: 'JEEMAIN-XII PHYSICS' },
        { id: 279, name: 'RAY OPTICS AND OPTICAL INSTRUMENTS' },
        { id: 275, name: 'ELECTROSTATIC POTENTIAL AND CAPACITANCE' },
        { id: 269, name: 'CURRENT ELECTRICITY' },
        { id: 277, name: 'MOVING CHARGES AND MAGNETISM' },
        { id: 1047, name: 'PHYSICS' }
      ]
    } : {
      maintopiclist: [
        { id: 776, name: 'RELATIONS AND FUNCTIONS' },
        { id: 777, name: 'VECTORS AND THREE - DIMENSIONAL GEOMETRY' },
        { id: 744, name: 'CALCULUS' },
        { id: 1, name: 'ALGEBRA' },
        { id: 778, name: 'LINEAR PROGRAMMING' },
        { id: 882, name: 'CONTINUITY AND DIFFERENTIABILITY' },
        { id: 883, name: 'APPLICATION OF DERIVATIVES' },
        { id: 243, name: 'INTEGRALS' },
        { id: 884, name: 'APPLICATION OF INTEGRALS' },
        { id: 237, name: 'DIFFERENTIAL EQUATIONS' },
        { id: 885, name: 'VECTOR ALGEBRA' },
        { id: 886, name: 'THREE DIMENSIONAL GEOMETRY' },
        { id: 779, name: 'PROBABILITY' },
        { id: 157, name: 'MATHS-JEE MAIN-AS-GT1' },
        { id: 244, name: 'INVERSE TRIGONOMETRIC FUNCTIONS' },
        { id: 880, name: 'MATRICES' },
        { id: 881, name: 'DETERMINANTS' },
        { id: 705, name: 'JEEMAIN-XII MATHS' },
        { id: 1048, name: 'MATHS' }
      ]
    };
    res.json(response);
  } else {
    res.status(400).json({ success: false, message: 'Invalid type' });
  }
});

// Fetch questions
app.get('/api/questions', async (req, res) => {
  const params = { TableName: QUESTIONS_TABLE };
  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items.map(item => ({ value: item.id, label: item.questionText }))); // Format for dropdown
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
});


app.use(cors());
app.use(express.json());

// --- Mock Data ---
const classlist = [
  { id: 7, name: 'XII' },
  { id: 6, name: 'XI' }
];

const sublist = [
  { id: 3, name: 'CHEMISTRY' },
  { id: 2, name: 'PHYSICS' },
  { id: 1, name: 'MATHS' }
];

const maintopiclistPhysics = [
  { id: 781, name: 'MAGNETIC EFFECTS OF CURRENT AND MAGNETISM' },
  { id: 280, name: 'WAVE OPTICS' },
  // ... more topics ...
];

const maintopiclistMaths = [
  { id: 776, name: 'RELATIONS AND FUNCTIONS' },
  { id: 777, name: 'VECTORS AND THREE - DIMENSIONAL GEOMETRY' },
  // ... more topics ...
];

app.get('/question/change', async (req, res) => {
  const { type, courseid, classid, subjectid } = req.query;

  try {
    if (type === 'getcourses') {
      // Get all courses
      const params = { TableName: COURSE_TABLE };
      const { Items } = await docClient.send(new ScanCommand(params));
      res.json({ courselist: Items.map(item => ({ id: item.course_id, name: item.name })) });
      return;
    }
    if (type === 'getclasses' && courseid) {
    console.log('Attempting to scan CLASS_TABLE:', CLASS_TABLE);
    const params = { TableName: CLASS_TABLE };
    try {
    const { Items } = await docClient.send(new ScanCommand(params));
    console.log('Fetched classes:', Items);
    res.json({ classlist: Items.map(item => ({ id: item.id, name: item.class_details })) });
    return;
  } catch (scanError) {
    console.error('Scan error for CLASS_TABLE:', scanError, 'TableName:', CLASS_TABLE);
    throw scanError;
  }
}
    if (type === 'getsubjects' && courseid && classid) {
      const params = {
        TableName: SUBJECT_TABLE,
        IndexName: 'courseId-index',
        KeyConditionExpression: 'course_id = :courseid',
        ExpressionAttributeValues: { ':courseid': Number(courseid) }
      };
      const { Items } = await docClient.send(new QueryCommand(params));
      res.json({ sublist: Items.map(item => ({ id: item.subject_id, name: item.name })) });
      return;
    }
    if (type === 'getmaintopics' && subjectid) {
      const params = { TableName: CHAPTER_TABLE };
      const { Items } = await docClient.send(new ScanCommand(params));
      res.json({ maintopiclist: Items.map(item => ({ id: item.id, name: item.chapter_number })) });
      return;
    }
    res.status(400).json({ success: false, message: 'Invalid parameters' });
  } catch (error) {
    console.error('Error in /question/change:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/institute/questionreference', async (req, res) => {
  console.log('API /institute/questionreference called');
  console.log('Request body:', req.body);
  const { questionId, questionRef, solutionEntry, answer, checked } = req.body;
  if (!questionId || !questionRef || !solutionEntry || !answer || checked === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const params = {
    TableName: QUESTIONS_TABLE,
    Item: {
      question_id: Number(questionId),
      questionText: questionRef,
      solutionEntry: solutionEntry,
      answer: answer,
      checked: !!checked // Boolean type for DynamoDB
    }
  };
  try {
  console.log('DynamoDB params:', params);
  const command = new PutCommand(params);
  await docClient.send(command);
  res.json({ success: true, message: 'Saved successfully!' });
} catch (error) {
  console.error('Error saving question reference:', error);
  res.status(500).json({ success: false, message: 'Failed to save data.' });
}
});

app.get('/institute/questionreferenceq/:question_id', async (req, res) => {
  const { question_id } = req.params;
  if (!question_id) {
    return res.status(400).json({ success: false, message: 'question_id is required.' });
  }
  const params = {
    TableName: QUESTIONS_TABLE,
    Key: { question_id: Number(question_id) }
  };
  try {
    const { Item } = await docClient.get(params);
    if (!Item) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({ success: true, data: Item });
  } catch (error) {
    console.error('Error fetching question reference:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.' });
  }
});

// GET student profile
app.get('/institute/student/home/getprofile', async (req, res) => {
  console.log('=== PROFILE GET API CALLED ===');
  const { student_id } = req.query;
  console.log('Requested student_id:', student_id);
  console.log('STUDENT_PROFILE table name:', STUDENT_PROFILE);

  if (!student_id) {
    console.log('student_id query parameter is missing');
    return res.status(400).json({ success: false, message: 'student_id query parameter is required.' });
  }

  try {
    const params = {
      TableName: STUDENT_PROFILE,
      Key: { student_id: Number(student_id) }
    };
    
    console.log('DynamoDB GetCommand params:', JSON.stringify(params, null, 2));
    
    const getCommand = new GetCommand(params);
    const result = await docClient.send(getCommand);
    const { Item } = result;
    
    console.log('DynamoDB get result:', result);
    console.log('Retrieved item:', Item);
    
    if (!Item) {
      console.log('Profile not found for student_id:', student_id);
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    
    // Get photo URL from S3 if photo_s3_key exists
    if (Item.photo_s3_key) {
      Item.photo_url = await getPhotoUrlFromS3(Item.photo_s3_key);
    }
    
    console.log('Profile found and returning to client');
    res.json({ success: true, profile: Item });
  } catch (error) {
    console.error('=== ERROR FETCHING PROFILE ===');
    console.error('Error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ResourceNotFoundException') {
      console.error('Table not found:', STUDENT_PROFILE);
    } else if (error.name === 'ValidationException') {
      console.error('Validation error:', error.message);
    } else if (error.name === 'AccessDeniedException') {
      console.error('Access denied to table:', STUDENT_PROFILE);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile.',
      error: error.message,
      errorType: error.name
    });
  }
});

// POST/PUT student profile
app.post('/institute/student/home/profile', async (req, res) => {
  console.log('=== PROFILE SAVE API CALLED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request headers:', req.headers);
  
  const {
    user_id,
    student_id,
    student_firstname,
    student_lastname,
    father_name,
    mobile_number,
    email,
    femail,
    gender,
    city,
    stprofile,
    photo_data,  // Added photo_data parameter
    updated_at   // Accept updated_at from request
  } = req.body;

  // Use student_id if provided, otherwise use user_id
  const primaryKey = student_id || user_id;

  console.log('Extracted fields:', {
    user_id,
    student_id,
    primaryKey,
    student_firstname,
    student_lastname,
    father_name,
    mobile_number,
    email,
    femail,
    gender,
    city,
    stprofile,
    photo_data: photo_data ? 'Photo data present' : 'No photo data',
    updated_at
  });

  if (!primaryKey || !student_firstname || !student_lastname || !email) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({ success: false, message: 'Required fields missing. Need student_id/user_id, student_firstname, student_lastname, and email.' });
  }

  try {
    console.log('STUDENT_PROFILE table name:', STUDENT_PROFILE);
    
    let photoS3Key = null;
    let oldPhotoS3Key = null;
    
    // If there's existing profile, get the old photo key for cleanup
    if (primaryKey) {
      try {
        const existingProfile = await docClient.send(new GetCommand({
          TableName: STUDENT_PROFILE,
          Key: { student_id: Number(primaryKey) }
        }));
        if (existingProfile.Item) {
          oldPhotoS3Key = existingProfile.Item.photo_s3_key;
        }
      } catch (err) {
        console.log('No existing profile found or error fetching:', err.message);
      }
    }
    
    // Handle photo upload to S3
    if (photo_data && photo_data.startsWith('data:image')) {
      console.log('Uploading photo to S3...');
      try {
        photoS3Key = await uploadPhotoToS3(photo_data, primaryKey);
        console.log('Photo uploaded to S3 with key:', photoS3Key);
        
        // Delete old photo if it exists and is different
        if (oldPhotoS3Key && oldPhotoS3Key !== photoS3Key) {
          await deletePhotoFromS3(oldPhotoS3Key);
          console.log('Old photo deleted from S3:', oldPhotoS3Key);
        }
      } catch (photoError) {
        console.error('Failed to upload photo to S3:', photoError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to upload photo. Please try again.' 
        });
      }
    } else if (oldPhotoS3Key) {
      // Keep existing photo if no new photo provided
      photoS3Key = oldPhotoS3Key;
    }
    
    const params = {
      TableName: STUDENT_PROFILE,
      Item: {
        student_id: Number(primaryKey),
        user_id: user_id ? Number(user_id) : Number(primaryKey),
        student_firstname,
        student_lastname,
        father_name: father_name || '',
        mobile_number: mobile_number || '',
        email,
        femail: femail || '',
        gender: gender || '',
        city: city || '',
        stprofile: stprofile || '',
        photo_s3_key: photoS3Key,  // Store S3 key instead of base64
        updated_at: updated_at || new Date().toISOString()
      }
    };
    
    console.log('DynamoDB PutCommand params:', JSON.stringify(params, null, 2));
    
    const putCommand = new PutCommand(params);
    const result = await docClient.send(putCommand);
    
    console.log('DynamoDB put result:', result);
    console.log('Profile saved successfully for student_id:', primaryKey);
    
    res.json({ success: true, message: `Profile saved successfully for student_id: ${primaryKey}` });
  } catch (error) {
    console.error('=== ERROR SAVING PROFILE ===');
    console.error('Error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ResourceNotFoundException') {
      console.error('Table not found:', STUDENT_PROFILE);
    } else if (error.name === 'ValidationException') {
      console.error('Validation error:', error.message);
    } else if (error.name === 'AccessDeniedException') {
      console.error('Access denied to table:', STUDENT_PROFILE);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save profile.',
      error: error.message,
      errorType: error.name
    });
  }
});

// GET signed URL for photo access
app.get('/institute/student/home/photo/:student_id', async (req, res) => {
  const { student_id } = req.params;
  
  if (!student_id) {
    return res.status(400).json({ success: false, message: 'student_id is required' });
  }

  try {
    // Get profile to find photo S3 key
    const params = {
      TableName: STUDENT_PROFILE,
      Key: { student_id: Number(student_id) }
    };
    
    const { Item } = await docClient.send(new GetCommand(params));
    
    if (!Item || !Item.photo_s3_key) {
      return res.json({ success: true, photo_url: null, message: 'No photo found' });
    }
    
    const photoUrl = await getPhotoUrlFromS3(Item.photo_s3_key);
    res.json({ success: true, photo_url: photoUrl });
  } catch (error) {
    console.error('Error getting photo URL:', error);
    res.status(500).json({ success: false, message: 'Failed to get photo URL' });
  }
});

app.put('/profile', async (req, res) => {
  const { student_id } = req.query;
  console.log('PUT /profile request:', { student_id, body: req.body });
  if (!student_id) {
    return res.status(400).json({ success: false, message: 'student_id is required.' });
  }
  const {
    firstName: student_firstname,
    lastName: student_lastname,
    fatherName: father_name,
    mobileNo: mobile_number,
    studentEmail: email,
    fatherEmail: femail,
    gender,
    city
  } = req.body;

  if (!student_firstname || !student_lastname || !mobile_number || !email || !gender) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  if (!/^\d{10}$/.test(mobile_number)) {
    return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  const updateExpression = 'set #fn = :fn, #ln = :ln, #fa = :fa, #mn = :mn, #em = :em, #fe = :fe, #ge = :ge, #ci = :ci';
  const expressionAttributeNames = {
    '#fn': 'student_firstname',
    '#ln': 'student_lastname',
    '#fa': 'father_name',
    '#mn': 'mobile_number',
    '#em': 'email',
    '#fe': 'femail',
    '#ge': 'gender',
    '#ci': 'city'
  };
  const expressionAttributeValues = {
    ':fn': student_firstname,
    ':ln': student_lastname,
    ':fa': father_name || '',
    ':mn': mobile_number,
    ':em': email,
    ':fe': femail || '',
    ':ge': gender,
    ':ci': city || 'None'
  };

  try {
    const params = {
      TableName: STUDENT_PROFILE,
      Key: { student_id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    console.log('DynamoDB Update params:', params);
    const result = await docClient.send(new UpdateCommand(params));
    res.json({ success: true, message: 'Profile updated successfully!', profile: result.Attributes });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile: ' + error.message });
  }
});

app.get('/institute/packages', async (req, res) => {
  console.log('=== PACKAGES API CALLED ===');
  try {
    console.log('Fetching packages from table:', PACKAGE_DETAILS);
    
    // Fetch all packages from PACKAGE_DETAILS table
    const packageParams = {
      TableName: PACKAGE_DETAILS
    };
    
    const { Items: packages } = await docClient.send(new ScanCommand(packageParams));
    console.log('Raw packages from DynamoDB:', packages);

    if (!packages || packages.length === 0) {
      return res.json({ success: true, packages: [], message: 'No packages found' });
    }

    // Get test counts for each package from TEST_DETAILS table
    const packagesWithTestCount = await Promise.all(
      packages.map(async (pkg) => {
        try {
          const testParams = {
            TableName: TEST_DETAILS,
            FilterExpression: 'package_id = :package_id',
            ExpressionAttributeValues: { ':package_id': pkg.package_id }
          };
          
          const { Items: tests } = await docClient.send(new ScanCommand(testParams));
          const testCount = tests ? tests.length : 0;
          
          return {
            id: pkg.package_id,
            name: pkg.package_name,
            testCount: testCount
          };
        } catch (testError) {
          console.error(`Error fetching test count for package ${pkg.package_id}:`, testError);
          return {
            id: pkg.package_id,
            name: pkg.package_name,
            testCount: 0
          };
        }
      })
    );
    
    console.log('Returning packages with test counts:', packagesWithTestCount);
    res.json({ success: true, packages: packagesWithTestCount, message: 'All packages loaded successfully' });
  } catch (error) {
    console.error('Error fetching all packages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch packages: ' + error.message });
  }
});

// GET packages for a specific user  
app.get('/institute/packages/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    console.log('Fetching packages for user_id:', user_id);
    console.log('Using PACKAGE_DETAILS table:', PACKAGE_DETAILS);
    
    // For now, return all packages regardless of user_id
    // You can modify this logic later to filter by user_id if needed
    const packageParams = {
      TableName: PACKAGE_DETAILS
    };
    
    const { Items: packages } = await docClient.send(new ScanCommand(packageParams));
    console.log('Raw packages from DynamoDB:', packages);

    if (!packages || packages.length === 0) {
      return res.json({ success: true, packages: [], message: 'No packages found for user' });
    }

    // Get test counts for each package from TEST_DETAILS table
    const packagesWithTestCount = await Promise.all(
      packages.map(async (pkg) => {
        try {
          const testParams = {
            TableName: TEST_DETAILS,
            FilterExpression: 'package_id = :package_id',
            ExpressionAttributeValues: { ':package_id': pkg.package_id }
          };
          
          const { Items: tests } = await docClient.send(new ScanCommand(testParams));
          const testCount = tests ? tests.length : 0;
          
          return {
            id: pkg.package_id,
            name: pkg.package_name,
            testCount: testCount
          };
        } catch (testError) {
          console.error(`Error fetching test count for package ${pkg.package_id}:`, testError);
          return {
            id: pkg.package_id,
            name: pkg.package_name,
            testCount: 0
          };
        }
      })
    );
    
    console.log('Returning packages with test counts for user:', packagesWithTestCount);
    res.json({ success: true, packages: packagesWithTestCount, message: 'Packages loaded successfully' });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch packages: ' + error.message });
  }
});

// GET tests for a specific package
app.get('/institute/packages/:package_id/tests', async (req, res) => {
  const { package_id } = req.params;
  
  if (!package_id) {
    return res.status(400).json({ success: false, message: 'package_id is required' });
  }

  const parsedPackageId = Number(package_id);
  if (isNaN(parsedPackageId)) {
    return res.status(400).json({ success: false, message: 'package_id must be a valid number' });
  }

  try {
    console.log('Fetching tests for package_id:', parsedPackageId);
    console.log('Using TEST_DETAILS table:', TEST_DETAILS);
    
    // Fetch tests from TEST_DETAILS table for the specific package
    const testParams = {
      TableName: TEST_DETAILS,
      FilterExpression: 'package_id = :package_id',
      ExpressionAttributeValues: { ':package_id': parsedPackageId }
    };
    
    const { Items: tests } = await docClient.send(new ScanCommand(testParams));
    console.log('Raw tests from DynamoDB:', tests);

    if (!tests || tests.length === 0) {
      return res.json({ success: true, tests: [], message: 'No tests found for this package' });
    }

    // Transform the data to match the expected format
    const formattedTests = tests.map(test => ({
      id: test.test_id,
      name: test.test_name,
      status: test.status || 'ready', // Default to 'ready' if status is not set
      questions: test.questions || 20, // Default question count
      duration: test.duration || '60 mins', // Default duration
      package_id: test.package_id,
      // Add any additional fields that might be in your TEST_DETAILS table
      start_date: test.start_date,
      end_date: test.end_date,
      current_date: test.current_date,
      current_time: test.current_time,
      start_time: test.start_time,
      end_time: test.end_time,
      testmapped: test.testmapped
    }));

    console.log('Returning formatted tests:', formattedTests);
    res.json({ success: true, tests: formattedTests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tests: ' + error.message });
  }
});

// Reports API endpoints
app.get('/api/reports/cumulative-performance/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const performanceData = {
      totalTests: 45,
      averageScore: 78.5,
      totalQuestions: 1250,
      correctAnswers: 982,
      accuracy: 78.56,
      monthlyData: [
        { month: 'Jan', score: 65, tests: 8 },
        { month: 'Feb', score: 72, tests: 12 },
        { month: 'Mar', score: 78, tests: 15 },
        { month: 'Apr', score: 85, tests: 10 }
      ]
    };
    
    res.json({ success: true, data: performanceData });
  } catch (error) {
    console.error('Error fetching cumulative performance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch performance data' });
  }
});

app.get('/api/reports/error-list/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const errorData = {
      totalErrors: 268,
      errorsBySubject: [
        { subject: 'Mathematics', errors: 89, percentage: 33.2 },
        { subject: 'Physics', errors: 76, percentage: 28.4 },
        { subject: 'Chemistry', errors: 103, percentage: 38.4 }
      ],
      commonErrors: [
        { topic: 'Calculus - Integration', errors: 45 },
        { topic: 'Physics - Mechanics', errors: 38 },
        { topic: 'Organic Chemistry', errors: 42 }
      ]
    };
    
    res.json({ success: true, data: errorData });
  } catch (error) {
    console.error('Error fetching error list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch error data' });
  }
});

app.get('/api/reports/question-review/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const reviewData = {
      totalQuestionsReviewed: 156,
      pendingReview: 89,
      reviewsByDifficulty: [
        { difficulty: 'Easy', reviewed: 45, pending: 12 },
        { difficulty: 'Medium', reviewed: 67, pending: 34 },
        { difficulty: 'Hard', reviewed: 44, pending: 43 }
      ],
      recentReviews: [
        { questionId: 101, topic: 'Algebra', status: 'Reviewed', date: '2025-09-28' },
        { questionId: 102, topic: 'Trigonometry', status: 'Pending', date: '2025-09-27' }
      ]
    };
    
    res.json({ success: true, data: reviewData });
  } catch (error) {
    console.error('Error fetching question review:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch review data' });
  }
});

app.get('/api/reports/practice-wrong/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const practiceData = {
      totalWrongQuestions: 145,
      unattemptedQuestions: 67,
      practiceSessionsCompleted: 23,
      improvementRate: 68.5,
      subjectWiseWrong: [
        { subject: 'Mathematics', wrong: 56, unattempted: 23 },
        { subject: 'Physics', wrong: 45, unattempted: 19 },
        { subject: 'Chemistry', wrong: 44, unattempted: 25 }
      ]
    };
    
    res.json({ success: true, data: practiceData });
  } catch (error) {
    console.error('Error fetching practice data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch practice data' });
  }
});

app.get('/api/reports/time-analysis/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const timeData = {
      totalTimeSpent: '45h 32m',
      averageTimePerQuestion: '2m 15s',
      fastestTest: '45m 20s',
      slowestTest: '2h 15m 30s',
      timeBySubject: [
        { subject: 'Mathematics', totalTime: '18h 45m', avgPerQuestion: '2m 30s' },
        { subject: 'Physics', totalTime: '15h 20m', avgPerQuestion: '2m 10s' },
        { subject: 'Chemistry', totalTime: '11h 27m', avgPerQuestion: '2m 05s' }
      ],
      timeDistribution: [
        { range: '0-1 min', questions: 234 },
        { range: '1-2 min', questions: 456 },
        { range: '2-3 min', questions: 321 },
        { range: '3+ min', questions: 189 }
      ]
    };
    
    res.json({ success: true, data: timeData });
  } catch (error) {
    console.error('Error fetching time analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch time data' });
  }
});

app.get('/api/reports/question-paper-weightage/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    // Mock data - replace with actual database queries
    const weightageData = {
      totalMarks: 300,
      marksObtained: 235,
      percentage: 78.33,
      subjectWeightage: [
        { 
          subject: 'Mathematics', 
          totalMarks: 100, 
          obtained: 78, 
          percentage: 78,
          topicWise: [
            { topic: 'Algebra', marks: 25, obtained: 20 },
            { topic: 'Calculus', marks: 35, obtained: 28 },
            { topic: 'Geometry', marks: 40, obtained: 30 }
          ]
        },
        { 
          subject: 'Physics', 
          totalMarks: 100, 
          obtained: 82, 
          percentage: 82,
          topicWise: [
            { topic: 'Mechanics', marks: 40, obtained: 35 },
            { topic: 'Thermodynamics', marks: 30, obtained: 25 },
            { topic: 'Optics', marks: 30, obtained: 22 }
          ]
        },
        { 
          subject: 'Chemistry', 
          totalMarks: 100, 
          obtained: 75, 
          percentage: 75,
          topicWise: [
            { topic: 'Organic', marks: 35, obtained: 28 },
            { topic: 'Inorganic', marks: 35, obtained: 25 },
            { topic: 'Physical', marks: 30, obtained: 22 }
          ]
        }
      ]
    };
    
    res.json({ success: true, data: weightageData });
  } catch (error) {
    console.error('Error fetching weightage data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch weightage data' });
  }
});

const server = awsServerlessExpress.createServer(app);

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
    console.log(`Profile API available at: http://localhost:${PORT}/institute/student/home/getprofile`);
  });
} else {
  // AWS Lambda handler
  exports.handler = (event, context) => {
    if (event.body && typeof event.body === 'object') {
      event.body = JSON.stringify(event.body);
    }
    return awsServerlessExpress.proxy(server, event, context);
  };
}

