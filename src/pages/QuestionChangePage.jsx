import React, { useState, useEffect } from 'react';

function QuestionChangePage() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [course, setCourse] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
  fetch('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/question/change?type=getcourses')
    .then(res => res.json())
    .then(data => setCourses(data.courselist || []))
    .catch(err => setCourses([]));
}, []);
  // Fetch all courses on mount
  useEffect(() => {
    fetch('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/question/change?type=getcourses')
      .then(res => res.json())
      .then(data => setCourses(data.courselist || []))
      .catch(err => setCourses([]));
  }, []);

  // Fetch classes when course changes
  useEffect(() => {
    if (course) {
      fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/question/change?type=getclasses&courseid=${course}`)
        .then(res => res.json())
        .then(data => setClasses(data.classlist || []))
        .catch(err => setClasses([]));
      setClassName('');
      setSubjects([]);
      setSubject('');
      setChapters([]);
      setChapter('');
    }
  }, [course]);

  // Fetch subjects when class changes
  useEffect(() => {
    if (course && className) {
      fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/question/change?type=getsubjects&courseid=${course}&classid=${className}`)
        .then(res => res.json())
        .then(data => setSubjects(data.sublist || []))
        .catch(err => setSubjects([]));
      setSubject('');
      setChapters([]);
      setChapter('');
    }
  }, [className, course]);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (course && className && subject) {
      fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/question/change?type=getmaintopics&courseid=${course}&classid=${className}&subjectid=${subject}`)
        .then(res => res.json())
        .then(data => setChapters(data.maintopiclist || []))
        .catch(err => setChapters([]));
      setChapter('');
    }
  }, [subject, className, course]);

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
                onChange={e => setCourse(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Class</label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
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
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '48px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
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
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#222' }}>Chapter</label>
              <select
                value={chapter}
                onChange={e => setChapter(e.target.value)}
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
                {chapters.map(ch => (
                  <option key={ch.id} value={ch.id}>{ch.name}</option>
                ))}
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
              onClick={() => {
  fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/questions?courseid=${course}&classid=${className}&subjectid=${subject}&chapterid=${chapter}`)
    .then(response => response.json())
    .then(data => setQuestions(Array.isArray(data) ? data : (data.questions || [])))
    .catch(error => {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    });
}}
              // onClick={() => {
              //   fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/api/questions?courseid=${course}&classid=${className}&subjectid=${subject}&chapterid=${chapter}`)
              //     .then(response => response.json())
              //     .then(data => console.log(data))
              //     .catch(error => console.error('Error fetching questions:', error));
              // }}
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
          {questions.length === 0 ? (
    <p>No questions found.</p>
  ) : (
    <ul>
      {questions.map(q => (
        <li key={q.id || q.value}>{q.label || q.questionText}</li>
      ))}
    </ul>
  )}
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

export default QuestionChangePage;