import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api-detailed';

function EditCampusPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    campus: '',
    name: '',
    mobile: '',
    email: '',
    location: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(API_ENDPOINTS.EDIT_CAMPUS(id))
        .then(response => {
          console.log('Campus data fetched:', response.data);
          setFormData({
            campus: response.data.campus || '',
            name: response.data.name || '',
            mobile: response.data.mobile || '',
            email: response.data.email || '',
            location: response.data.location || '',
            displayName: response.data.displayName || ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching campus:', err);
          setError('Failed to load campus data');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError('Invalid campus ID');
      return;
    }
    try {
      const response = await axios.put(API_ENDPOINTS.EDIT_CAMPUS(id), formData);
      if (response.data.success) {
        alert('Campus updated successfully!'); // Or use a better notification
        navigate('/campus'); // Redirect back to campus list
      }
    } catch (err) {
      setError('Failed to update campus. Please try again.');
      console.error('Error updating campus:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#00A8CC' }}>Edit Campus</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Campus Name</label>
          <input
            type="text"
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            placeholder="Enter your institute name"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Contact Person Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name of the head/contact person"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your contact number"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Email-address"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your Location"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Browser display name"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          style={{ backgroundColor: '#00A8CC', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
        >
          Update Campus
        </button>
        <button
          type="button"
          onClick={() => navigate('/campus')}
          style={{ backgroundColor: '#ccc', color: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer', marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditCampusPage;