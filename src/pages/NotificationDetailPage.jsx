import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, requireAuth } from '../utils/auth';
import { API_ENDPOINTS } from '../config/api-detailed';
import './NotificationDetailPage.css';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!requireAuth(navigate)) return;
    fetchNotificationDetails();
  }, [id, navigate]);

  const fetchNotificationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
      const data = await response.json();

      if (data.success) {
        setNotification(data.notification);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch notification details');
      }
    } catch (err) {
      console.error('Error fetching notification details:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '–' || dateString === '-') return '–';
    try {
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getStatusInfo = (notification) => {
    if (!notification) return { status: 'unknown', color: '#666', text: 'Unknown' };
    
    const now = new Date();
    const lastDate = notification.last_date;
    
    if (!lastDate || lastDate === '–' || lastDate === '-') {
      return { status: 'ongoing', color: '#2196F3', text: 'Ongoing' };
    }
    
    try {
      const endDate = new Date(lastDate);
      if (endDate < now) {
        return { status: 'expired', color: '#f44336', text: 'Expired' };
      } else {
        return { status: 'active', color: '#4CAF50', text: 'Active' };
      }
    } catch {
      return { status: 'ongoing', color: '#2196F3', text: 'Ongoing' };
    }
  };

  const handleBackClick = () => {
    navigate('/notifications');
  };

  const handleApplyClick = () => {
    if (notification?.application_link) {
      window.open(notification.application_link, '_blank');
    } else {
      alert('Application link not available. Please check the official notification.');
    }
  };

  if (loading) {
    return (
      <div className="notification-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notification details...</p>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="notification-detail-page">
        <div className="error-container">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Error</h2>
            <p>{error || 'Notification not found'}</p>
            <button onClick={handleBackClick} className="btn-back">
              <i className="fas fa-arrow-left"></i>
              Back to Notifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(notification);

  return (
    <div className="notification-detail-page">
      <div className="detail-header">
        <div className="header-content">
          <button onClick={handleBackClick} className="btn-back-header">
            <i className="fas fa-arrow-left"></i>
            Back to Notifications
          </button>
          <div className="header-info">
            <h1 className="notification-title">{notification.post_name}</h1>
            <div className="notification-meta">
              <span className="recruitment-board">
                <i className="fas fa-building"></i>
                {notification.recruitment_board}
              </span>
              <span className="post-date">
                <i className="fas fa-calendar"></i>
                Posted: {formatDate(notification.post_date)}
              </span>
              <span className={`status-badge status-${statusInfo.status}`}>
                <i className="fas fa-circle"></i>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="content-wrapper">
          <div className="main-content">
            <div className="info-card">
              <h2>
                <i className="fas fa-info-circle"></i>
                Notification Details
              </h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Post Name:</label>
                  <span>{notification.post_name}</span>
                </div>
                <div className="info-item">
                  <label>Recruitment Board:</label>
                  <span>{notification.recruitment_board}</span>
                </div>
                <div className="info-item">
                  <label>Qualification Required:</label>
                  <span>{notification.qualification}</span>
                </div>
                <div className="info-item">
                  <label>Advertisement No:</label>
                  <span>{notification.advt_no || '–'}</span>
                </div>
                <div className="info-item">
                  <label>Post Date:</label>
                  <span>{formatDate(notification.post_date)}</span>
                </div>
                <div className="info-item">
                  <label>Last Date:</label>
                  <span className={statusInfo.status === 'expired' ? 'expired-date' : ''}>
                    {formatDate(notification.last_date)}
                  </span>
                </div>
              </div>
            </div>

            {notification.description && (
              <div className="info-card">
                <h2>
                  <i className="fas fa-file-alt"></i>
                  Description
                </h2>
                <div className="description-content">
                  <p>{notification.description}</p>
                </div>
              </div>
            )}

            {notification.eligibility_criteria && (
              <div className="info-card">
                <h2>
                  <i className="fas fa-check-circle"></i>
                  Eligibility Criteria
                </h2>
                <div className="criteria-content">
                  <p>{notification.eligibility_criteria}</p>
                </div>
              </div>
            )}

            {notification.application_process && (
              <div className="info-card">
                <h2>
                  <i className="fas fa-clipboard-list"></i>
                  Application Process
                </h2>
                <div className="process-content">
                  <p>{notification.application_process}</p>
                </div>
              </div>
            )}

            {notification.important_dates && Object.keys(notification.important_dates).length > 0 && (
              <div className="info-card">
                <h2>
                  <i className="fas fa-calendar-alt"></i>
                  Important Dates
                </h2>
                <div className="dates-content">
                  {Object.entries(notification.important_dates).map(([key, value]) => (
                    <div key={key} className="date-item">
                      <label>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sidebar">
            <div className="action-card">
              <h3>
                <i className="fas fa-rocket"></i>
                Quick Actions
              </h3>
              <div className="action-buttons">
                <button 
                  className="btn-apply"
                  onClick={handleApplyClick}
                  disabled={statusInfo.status === 'expired'}
                >
                  <i className="fas fa-paper-plane"></i>
                  {statusInfo.status === 'expired' ? 'Application Closed' : 'Apply Now'}
                </button>
                <button className="btn-download">
                  <i className="fas fa-download"></i>
                  Download Notification
                </button>
                <button className="btn-share">
                  <i className="fas fa-share-alt"></i>
                  Share Notification
                </button>
              </div>
            </div>

            <div className="status-card">
              <h3>
                <i className="fas fa-chart-line"></i>
                Status Information
              </h3>
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Current Status:</span>
                  <span className={`status-value status-${statusInfo.status}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Notification Type:</span>
                  <span className="status-value">
                    {notification.notification_type?.toUpperCase() || 'GENERAL'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Updated:</span>
                  <span className="status-value">
                    {notification.updated_at ? 
                      new Date(notification.updated_at).toLocaleDateString() : 
                      formatDate(notification.post_date)
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="help-card">
              <h3>
                <i className="fas fa-question-circle"></i>
                Need Help?
              </h3>
              <div className="help-content">
                <p>If you have questions about this notification, please contact:</p>
                <ul>
                  <li>
                    <i className="fas fa-phone"></i>
                    Support: +91-1234567890
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i>
                    Email: support@citineschools.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailPage;
