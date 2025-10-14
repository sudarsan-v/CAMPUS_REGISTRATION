import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectionPage() {
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]); // State to store table rows

  useEffect(() => {
    setLoading(true);
    axios.get('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/campuses') // Replace with your API URL
      .then(response => {
        setCampuses(response.data);
      })
      .catch(error => console.error('Error fetching campuses:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleCampusChange = (e) => {
    const campus_id = e.target.value;
    setSelectedCampus(campus_id);
    setSelectedCourse('');
    setSubjects([]);
    setLoading(true);
    axios.get(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/courses?campus_id=${campus_id}`)
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => console.error('Error fetching courses:', error))
      .finally(() => setLoading(false));
  };

  const handleCourseChange = (e) => {
    const course_id = e.target.value;
    setSelectedCourse(course_id);
    setLoading(true);
    axios.get(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/subjects?course_id=${course_id}`)
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => console.error('Error fetching subjects:', error))
      .finally(() => setLoading(false));
  };

  // Function to add selected items to the table
  const handleAddToTable = () => {
    if (selectedCampus && selectedCourse && subjects.length > 0) {
      const campus = campuses.find(c => c.campus_id === Number(selectedCampus))?.name || selectedCampus;
      const course = courses.find(c => c.course_id === Number(selectedCourse))?.name || selectedCourse;
      const subject = subjects.find(s => s.id === subjects[0].id)?.name || subjects[0].id; // Assuming first subject for simplicity

      setTableData([...tableData, { campus, course, subject }]);
      // Optionally clear selections after adding
      setSelectedCampus('');
      setSelectedCourse('');
      setSubjects([]);
    } else {
      alert('Please select a campus, course, and subject.');
    }
  };

  // Function to delete a row from the table
  const handleDeleteRow = (index) => {
    setTableData(tableData.filter((_, i) => i !== index));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Select Campus, Course, and Subject</h2>
      <select value={selectedCampus} onChange={handleCampusChange}>
        <option value="">Select Campus</option>
        {campuses.map(campus => (
          <option key={campus.campus_id} value={campus.campus_id}>{campus.name}</option>
        ))}
      </select>
      <select value={selectedCourse} onChange={handleCourseChange} disabled={!selectedCampus}>
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course.course_id} value={course.course_id}>{course.name}</option>
        ))}
      </select>
      <select disabled={!selectedCourse}>
        <option value="">Select Subject</option>
        {subjects.map(subject => (
          <option key={subject.id} value={subject.id}>{subject.name}</option>
        ))}
      </select>
      <button
        onClick={handleAddToTable}
        style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add
      </button>

      {/* Table to display selected items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Campus</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} style={{ border: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.campus}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.course}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.subject}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => handleDeleteRow(index)}
                  style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectionPage;