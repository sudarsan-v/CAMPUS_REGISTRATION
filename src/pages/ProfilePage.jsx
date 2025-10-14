import React, { useState, useEffect } from 'react';
import { getCurrentUser, requireAuth, getUserId } from '../utils/auth';
import API_BASE_URL, { PROFILE_API_URL } from '../config/api-detailed';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    student_firstname: '',
    student_lastname: '',
    father_name: '',
    mobile_number: '',
    email: '',
    femail: '',
    adhar_number: '',
    gender: 'Female',
    city: '',
    stprofile: 'studentpart',
    photo_s3_key: null,  // Changed from photo_data to photo_s3_key
    photo_url: null      // Added for displaying S3 photo URL
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);  // For preview of new photo
  const [photoDataToUpload, setPhotoDataToUpload] = useState(null);  // Base64 data to upload

  // Debug auth on component mount
  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    const user = getCurrentUser();
    const userId = getUserId();
    console.log('Current user from sessionStorage:', user);
    console.log('User ID:', userId);
    console.log('Is authenticated:', !!user && !!userId);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('=== PROFILE FETCH CALLED ===');
      try {
        // Check authentication and get user ID
        if (!requireAuth()) {
          console.log('Authentication failed');
          return;
        }
        
        const userId = getUserId();
        console.log('Retrieved userId for fetch:', userId);
        
        if (!userId) {
          console.log('No userId found');
          setError('Please login again. User session not found.');
          return;
        }

        const apiUrl = `${PROFILE_API_URL}/institute/student/home/getprofile?student_id=${userId}`;
        console.log('Fetching from URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Fetch response status:', response.status);
        
        const data = await response.json();
        console.log('Fetch response data:', data);
        
        if (data.success) {
          console.log('Profile data received:', data.profile);
          setProfile(data.profile);
          
          // Fetch photo URL if photo_s3_key exists
          if (data.profile.photo_s3_key) {
            fetchPhotoUrl(userId);
          }
        } else {
          console.log('Profile fetch failed:', data.message);
          setError('Failed to load profile: ' + data.message);
        }
      } catch (err) {
        console.error('=== ERROR FETCHING PROFILE ===');
        console.error('Error details:', err);
        console.error('Error message:', err.message);
        setError('Error fetching profile: ' + err.message);
      }
    };
    fetchProfile();
  }, []);

  const fetchPhotoUrl = async (studentId) => {
    try {
      const photoResponse = await fetch(`${PROFILE_API_URL}/institute/student/home/photo/${studentId}`);
      const photoData = await photoResponse.json();
      
      if (photoData.success && photoData.photo_url) {
        setProfile(prev => ({ ...prev, photo_url: photoData.photo_url }));
      }
    } catch (err) {
      console.error('Error fetching photo URL:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg') && file.size < 2 * 1024 * 1024) {
      setSelectedFile(file);
      
      // Convert file to base64 string for upload
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setPhotoDataToUpload(base64String);
        setPhotoPreview(base64String);  // Set preview
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file (PNG/JPG, max 2MB)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('=== PROFILE SUBMIT CALLED ===');

    try {
      const userId = getUserId();
      console.log('Retrieved userId from auth:', userId);
      
      if (!userId) {
        console.log('No userId found, authentication failed');
        setError('User session not found. Please login again.');
        return;
      }

      const requestData = {
        user_id: userId,
        ...profile
      };
      
      // Add photo data only if there's a new photo to upload
      if (photoDataToUpload) {
        requestData.photo_data = photoDataToUpload;
      }
      
      console.log('Request data being sent:', JSON.stringify(requestData, null, 2));
      console.log('API endpoint:', `${PROFILE_API_URL}/institute/student/home/profile`);

      const response = await fetch(`${PROFILE_API_URL}/institute/student/home/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('Profile save successful');
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setSelectedFile(null);
        setPhotoPreview(null);
        setPhotoDataToUpload(null);
        
        // Refresh photo URL if a new photo was uploaded
        if (photoDataToUpload) {
          setTimeout(() => fetchPhotoUrl(userId), 1000);  // Small delay for S3 processing
        }
      } else {
        console.log('Profile save failed:', data.message);
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('=== ERROR IN FRONTEND ===');
      console.error('Error details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError('Error updating profile: ' + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#5ec4e3', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Student Profile</h2>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '10px', fontWeight: 'bold' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>First Name:</label>
              <input
                type="text"
                name="student_firstname"
                value={profile.student_firstname}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Last Name:</label>
              <input
                type="text"
                name="student_lastname"
                value={profile.student_lastname}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
                required
              />
            </div>

            <div rowSpan="4" style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Upload Photo:</div>
              <div style={{
                width: '200px',
                height: '200px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                overflow: 'hidden'
              }}>
                {photoPreview || profile.photo_url || selectedFile ? (
                  <img 
                    src={photoPreview || profile.photo_url || (selectedFile ? URL.createObjectURL(selectedFile) : '')} 
                    alt="Profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
                    <div>No Image</div>
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange}
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    PNG/JPG format, max 2MB
                  </div>
                </>
              )}
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Father Name:</label>
              <input
                type="text"
                name="father_name"
                value={profile.father_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Mobile No:</label>
              <input
                type="tel"
                name="mobile_number"
                value={profile.mobile_number}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Student Email Id:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Father Email Id:</label>
              <input
                type="email"
                name="femail"
                value={profile.femail}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Father Email"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Gender:</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>City:</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f5f5f5'
                }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#ff9800',
                  color: 'white',
                  padding: '12px 30px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                EDIT
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '12px 30px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  SUBMIT
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '12px 30px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;