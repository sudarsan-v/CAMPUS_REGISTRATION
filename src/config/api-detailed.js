// Centralized API Configuration System
// All API endpoints are managed from this single file

// Environment-specific API base URLs
const API_CONFIGS = {
  // Local development server
  LOCAL_TEST: process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:3002',
  
  // Current production API Gateway
  PRODUCTION: process.env.REACT_APP_PROD_API_URL || 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev',
  
  // Working production endpoints
  PRODUCTION_WORKING: process.env.REACT_APP_PROD_API_URL || 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev'
};

// Current configuration - controlled by environment variables or fallback
const CURRENT_ENV = process.env.REACT_APP_API_ENV || 'PRODUCTION_WORKING';
const CURRENT_CONFIG = CURRENT_ENV;

// Main API base URL
const API_BASE_URL = API_CONFIGS[CURRENT_CONFIG];

export default API_BASE_URL;

// Specific API endpoint configurations
export const PROFILE_API_URL = process.env.REACT_APP_PROFILE_API_URL || API_CONFIGS[CURRENT_CONFIG];
export const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL || API_CONFIGS[CURRENT_CONFIG];

// Centralized endpoint builder
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Common API endpoints - use these throughout the application
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: buildApiUrl('/api/login'),
  LOGOUT: buildApiUrl('/api/logout'),
  CHANGE_PASSWORD: buildApiUrl('/api/changepassword'),
  
  // Campus Management
  CAMPUS: () => buildApiUrl('/api/campus'),
  CAMPUSES: () => buildApiUrl('/campuses'),
  CAMPUS_SEARCH: (search) => buildApiUrl(`/api/campus/search?search=${encodeURIComponent(search)}`),
  ADD_CAMPUS: () => buildApiUrl('/api/addcampus'),
  EDIT_CAMPUS: (id) => buildApiUrl(`/api/editcampus/${id}`),
  
  // Course Management
  COURSES: (campusId) => buildApiUrl(`/courses?campus_id=${campusId}`),
  SUBJECTS: (courseId) => buildApiUrl(`/subjects?course_id=${courseId}`),
  
  // Student Profile
  PROFILE_UPDATE: buildApiUrl('/institute/student/home/profile'),
  PROFILE_GET: (studentId) => buildApiUrl(`/institute/student/home/getprofile?student_id=${studentId}`),
  PROFILE_PHOTO: (studentId) => buildApiUrl(`/institute/student/home/photo/${studentId}`),
  
  // Questions
  QUESTIONS: () => buildApiUrl('/api/questions'),
  QUESTION_CHANGE: () => buildApiUrl('/question/change'),
  QUESTION_CHANGE_COURSES: () => buildApiUrl('/question/change?type=getcourses'),
  QUESTION_CHANGE_CLASSES: (courseId) => buildApiUrl(`/question/change?type=getclasses&courseid=${courseId}`),
  QUESTION_CHANGE_SUBJECTS: (courseId, classId) => buildApiUrl(`/question/change?type=getsubjects&courseid=${courseId}&classid=${classId}`),
  QUESTION_CHANGE_CHAPTERS: (courseId, classId, subjectId) => buildApiUrl(`/question/change?type=getmaintopics&courseid=${courseId}&classid=${classId}&subjectid=${subjectId}`),
  QUESTION_FILTER: (courseId, classId, subjectId, chapterId) => buildApiUrl(`/api/questions?courseid=${courseId}&classid=${classId}&subjectid=${subjectId}&chapterid=${chapterId}`),
  QUESTION_REFERENCE: () => buildApiUrl('/institute/questionreference'),
  QUESTION_REFERENCE_BY_ID: (questionId) => buildApiUrl(`/institute/questionreferenceq/${questionId}`),
  
  // Reports
  REPORTS: (reportType, userId) => buildApiUrl(`/api/reports/${reportType}/${userId}`),
  
  // Packages
  PACKAGES: buildApiUrl('/institute/packages'),
  PACKAGE_BY_ID: (packageId) => buildApiUrl(`/institute/packages/${packageId}`),
  PACKAGE_TESTS: (packageId) => buildApiUrl(`/institute/packages/${packageId}/tests`),
  USER_PACKAGES: (userId) => buildApiUrl(`/institute/packages/user/${userId}`),
  
  // Notifications
  NOTIFICATIONS: buildApiUrl('/api/notifications'),
  NOTIFICATION_BY_ID: (id) => buildApiUrl(`/api/notifications/${id}`),
  CREATE_NOTIFICATION: buildApiUrl('/api/notifications'),
  UPDATE_NOTIFICATION: (id) => buildApiUrl(`/api/notifications/${id}`),
  DELETE_NOTIFICATION: (id) => buildApiUrl(`/api/notifications/${id}`)
};

// Environment information (for debugging)
export const API_CONFIG_INFO = {
  current_environment: CURRENT_CONFIG,
  base_url: API_BASE_URL,
  is_local: CURRENT_CONFIG === 'LOCAL_TEST',
  is_production: CURRENT_CONFIG.includes('PRODUCTION'),
  available_environments: Object.keys(API_CONFIGS)
};
