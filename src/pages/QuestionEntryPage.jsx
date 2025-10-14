// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // For navigation

// function QuestionEntryPage() {
//   const navigate = useNavigate(); // Hook for programmatic navigation

//   const handleAddNewQuestion = () => {
//     navigate('/new-question-form'); // Redirect to new question form page
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
//       <h2>Question Entry Page</h2>
//       <button
//         onClick={handleAddNewQuestion}
//         style={{ backgroundColor: '#005F73', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
//       >
//         Add New Question
//       </button>
//     </div>
//   );
// }

// export default QuestionEntryPage;

import React, { useState } from 'react';

function QuestionEntryPage() {
  const [courses] = useState([
    { id: 30, name: 'Math' },
    { id: 31, name: 'Science' },
    { id: 32, name: 'English' }
  ]);
  const [course, setCourse] = useState('');
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState('');

  // Handle course change
  const handleCourseChange = async (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);
    setClassName('');
    setSubject('');
    setChapter('');
    setClasses([]);
    setSubjects([]);
    setChapters([]);
    if (selectedCourse) {
      const res = await fetch('/question/change/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseid: selectedCourse, type: 'getclasses' })
      });
      const data = await res.json();
      setClasses(data.classlist || []);
    }
  };

  // Handle class change
  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setClassName(selectedClass);
    setSubject('');
    setChapter('');
    setSubjects([]);
    setChapters([]);
    if (selectedClass) {
      const res = await fetch('/question/change/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseid: course, classid: selectedClass, type: 'getsubjects' })
      });
      const data = await res.json();
      setSubjects(data.sublist || []);
    }
  };

  // Handle subject change
  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSubject(selectedSubject);
    setChapter('');
    setChapters([]);
    if (selectedSubject) {
      const res = await fetch('/question/change/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseid: course, classid: className, subjectid: selectedSubject, type: 'getmaintopics' })
      });
      const data = await res.json();
      setChapters(data.maintopiclist || []);
    }
  };

  // Handle chapter change
  const handleChapterChange = (e) => {
    setChapter(e.target.value);
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{
        padding: '32px 24px 0 24px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #7fd3ea',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <form>
          <div style={{ display: 'flex', gap: '48px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Course</label>
              <select
                value={course}
                onChange={handleCourseChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Class</label>
              <select
                value={className}
                onChange={handleClassChange}
                disabled={!classes.length}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '48px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Subject</label>
              <select
                value={subject}
                onChange={handleSubjectChange}
                disabled={!subjects.length}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Chapter</label>
              <select
                value={chapter}
                onChange={handleChapterChange}
                disabled={!chapters.length}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              type="button"
              style={{
                background: '#57c3e8',
                color: '#222',
                padding: '10px 32px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={e => e.target.style.background = '#0099cc'}
              onMouseOut={e => e.target.style.background = '#57c3e8'}
            >
              Get Questions
            </button>
          </div>
        </form>
        <div style={{
          minHeight: '220px',
          background: '#f5f7fa',
          borderRadius: '4px',
          border: '1px solid #e0e0e0',
          marginBottom: '24px',
          padding: '16px'
        }}>
          {/* Display fetched data for debugging */}
          <p>Classes: {classes.length > 0 ? classes.map(c => c.name).join(', ') : 'No classes'}</p>
          <p>Subjects: {subjects.length > 0 ? subjects.map(s => s.name).join(', ') : 'No subjects'}</p>
          <p>Chapters: {chapters.length > 0 ? chapters.map(ch => ch.name).join(', ') : 'No chapters'}</p>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#222',
          fontWeight: 'bold',
          fontSize: '1rem',
          padding: '12px 0'
        }}>
          <span>Total Updated question count : 0</span>
          <span>Today Updated question count : 0</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionEntryPage;