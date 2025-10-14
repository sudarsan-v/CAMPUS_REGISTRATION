import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CampusPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (search = '', showHiddenParam = showHidden) => {
    setLoading(false);
    try {
      let url = 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/campus';
      if (search) {
        url = `https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/campus/search?search=${encodeURIComponent(search)}`;
      }
      url += `${search ? '&' : '?'}showHidden=${showHiddenParam}`;
      const response = await axios.get(url);
      console.log('Data fetched:', response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    fetchData(term);
  };

  const handleShowHiddenChange = (e) => {
    const checked = e.target.checked;
    setShowHidden(checked);
    setCurrentPage(1); // Reset to first page when toggling hidden
    fetchData(searchTerm, checked);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleHide = async (row, checked) => {
    try {
      await axios.put(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/editcampus/${row.id}`, { hidden: checked });
      // Update the local state immediately to reflect the change
      setData(prevData => 
        prevData.map(item => 
          item.id === row.id ? { ...item, hidden: checked } : item
        )
      );
      // Also fetch fresh data to ensure consistency
      fetchData(searchTerm, showHidden);
    } catch (err) {
      console.error('Error updating hidden status:', err);
      setError('Failed to update hidden status');
    }
  };

  const handleEdit = (row) => {
    navigate(`/edit-campus/${row.id}`);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];
      if (sortColumn === 'id') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortColumn === 'mobile') {
        valA = parseInt(valA || '0', 10);
        valB = parseInt(valB || '0', 10);
      } else {
        valA = (valA || '').toString();
        valB = (valB || '').toString();
      }
      if (sortDirection === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });
  }, [data, sortColumn, sortDirection]);

  // Calculate pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Calculate hidden count
  const hiddenCount = data.filter(item => item.hidden).length;

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getSortIndicator = (column) => {
    if (sortColumn !== column) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#00A8CC' }}>Campus Registration</h2>
      <button
        style={{ float: 'right', backgroundColor: '#00A8CC', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
        onClick={() => navigate('/add-campus')}
      >
        +Add Campus
      </button>
      <div style={{ marginBottom: '10px' }}>
        <label>Show </label>
        <select 
          style={{ marginRight: '10px' }}
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <label>entries</label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={handleShowHiddenChange}
          /> Show Hidden ({hiddenCount})
        </label>
        <input
          type="text"
          placeholder="Search:"
          value={searchTerm}
          onChange={handleSearch}
          style={{ float: 'right', padding: '5px' }}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#00A8CC', color: 'white' }}>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('id')}>
              Campus ID {getSortIndicator('id')}
            </th>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('campus')}>
              Campus {getSortIndicator('campus')}
            </th>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('name')}>
              Name {getSortIndicator('name')}
            </th>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('mobile')}>
              Mobile No {getSortIndicator('mobile')}
            </th>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('email')}>
              E-mail {getSortIndicator('email')}
            </th>
            <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('location')}>
              Location {getSortIndicator('location')}
            </th>
            <th style={{ padding: '10px' }}>Hide</th>
            <th style={{ padding: '10px' }}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{row.id}</td>
              <td style={{ padding: '10px' }}>{row.campus}</td>
              <td style={{ padding: '10px' }}>{row.name}</td>
              <td style={{ padding: '10px' }}>{row.mobile}</td>
              <td style={{ padding: '10px' }}>{row.email}</td>
              <td style={{ padding: '10px' }}>{row.location}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={row.hidden || false} 
                  onChange={(e) => handleHide(row, e.target.checked)} 
                />
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button 
                  style={{ backgroundColor: '#00A8CC', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }} 
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ clear: 'both' }}>
        <p style={{ textAlign: 'center' }}>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          {searchTerm && ` (filtered from ${data.length} total entries)`}
        </p>
        <div style={{ textAlign: 'center' }}>
          <button 
            style={{ 
              margin: '0 5px', 
              padding: '5px 10px',
              backgroundColor: currentPage === 1 ? '#ccc' : '#00A8CC',
              color: 'white',
              border: 'none',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={{ margin: '0 15px', fontWeight: 'bold' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            style={{ 
              margin: '0 5px', 
              padding: '5px 10px',
              backgroundColor: currentPage === totalPages ? '#ccc' : '#00A8CC',
              color: 'white',
              border: 'none',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampusPage;