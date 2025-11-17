import React, { useState, useEffect } from 'react';
import { getCurrentUser, requireAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api-detailed';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!requireAuth(navigate)) return;
    fetchNotifications();
  }, [currentPage, selectedType, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.NOTIFICATIONS}?page=${currentPage}&limit=10&type=${selectedType}`
      );
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.post_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.recruitment_board.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (notificationId) => {
    navigate(`/notifications/${notificationId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '–' || dateString === '-') return '–';
    try {
      // Handle various date formats
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (notification) => {
    const now = new Date();
    const lastDate = notification.last_date;
    
    if (!lastDate || lastDate === '–' || lastDate === '-') {
      return <span className="status-badge ongoing">Ongoing</span>;
    }
    
    try {
      const endDate = new Date(lastDate);
      if (endDate < now) {
        return <span className="status-badge expired">Expired</span>;
      } else {
        return <span className="status-badge active">Active</span>;
      }
    } catch {
      return <span className="status-badge ongoing">Ongoing</span>;
    }
  };

  const getPriorityClass = (type) => {
    switch (type) {
      case 'urgent': return 'priority-high';
      case 'important': return 'priority-medium';
      default: return 'priority-normal';
    }
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-bell"></i>
            Latest Exam Notifications
          </h1>
          <p className="page-subtitle">Stay updated with the latest exam and recruitment notifications</p>
        </div>
      </div>

      <div className="notifications-controls">
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-container">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="exam">Exam Notifications</option>
            <option value="recruitment">Recruitment</option>
            <option value="result">Results</option>
            <option value="admission">Admissions</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        </div>
      )}

      <div className="notifications-container">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <i className="fas fa-bell-slash"></i>
            <h3>No Notifications Found</h3>
            <p>There are no notifications matching your search criteria.</p>
          </div>
        ) : (
          <div className="notifications-table-container">
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>Post Date</th>
                  <th>Recruitment Board</th>
                  <th>Post Name</th>
                  <th>Qualification</th>
                  <th>Advt No</th>
                  <th>Last Date</th>
                  <th>Status</th>
                  <th>More Information</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className={`notification-row ${getPriorityClass(notification.notification_type)}`}>
                    <td className="post-date">{formatDate(notification.post_date)}</td>
                    <td className="recruitment-board">
                      <div className="board-info">
                        <strong>{notification.recruitment_board}</strong>
                      </div>
                    </td>
                    <td className="post-name">
                      <div className="post-details">
                        <h4>{notification.post_name}</h4>
                        {notification.description && (
                          <p className="post-description">{notification.description.substring(0, 100)}...</p>
                        )}
                      </div>
                    </td>
                    <td className="qualification">
                      <div className="qualification-text">
                        {notification.qualification}
                      </div>
                    </td>
                    <td className="advt-no">
                      {notification.advt_no || '–'}
                    </td>
                    <td className="last-date">
                      <div className="date-info">
                        {formatDate(notification.last_date)}
                      </div>
                    </td>
                    <td className="status">
                      {getStatusBadge(notification)}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleViewDetails(notification.id)}
                        className="btn-details"
                        title="Get Details"
                      >
                        <i className="fas fa-info-circle"></i>
                        Get Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </button>
            
            <div className="pagination-info">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      <div className="notifications-footer">
        <div className="footer-info">
          <p>
            <i className="fas fa-info-circle"></i>
            Notifications are updated regularly. Please check back frequently for the latest updates.
          </p>
          <p className="copyright">
            All rights reserved - Campus Registration System © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
