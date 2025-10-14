import React, { useState } from 'react';

function SolutionEntryPage() {
  const [questionId, setQuestionId] = useState('');
  const [questionRef, setQuestionRef] = useState('');
  const [solutionEntry, setSolutionEntry] = useState('');
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch question reference by ID
  const handleFetch = async () => {
    setSuccessMsg('');
    if (!questionId) {
      setSuccessMsg('Please enter a Question ID to fetch.');
      return;
    }
    try {
      const response = await fetch(`https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/institute/questionreferenceq/${questionId}`);
      const data = await response.json();
      if (data.success && data.data) {
        setQuestionRef(data.data.questionText || '');
        setSolutionEntry(data.data.solutionEntry || '');
        setAnswer(data.data.answer || '');
        setChecked(!!data.data.checked);
        setSuccessMsg('Question loaded.');
      } else {
        setSuccessMsg(data.message || 'Question not found.');
        setQuestionRef('');
        setSolutionEntry('');
        setAnswer('');
        setChecked(false);
      }
    } catch (error) {
      setSuccessMsg('Failed to fetch question.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const response = await fetch('https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev/institute/questionreference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          questionRef,
          solutionEntry,
          answer,
          checked
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setQuestionId('');
        setQuestionRef('');
        setSolutionEntry('');
        setAnswer('');
        setChecked(false);
      } else {
        setSuccessMsg(data.message || 'Failed to save.');
      }
    } catch (error) {
      setSuccessMsg('Failed to save.');
    }
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #7fd3ea'
      }}>
        <div style={{
          background: '#57c3e8',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          padding: '20px 0',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: 0,
            color: '#222',
            fontWeight: 'bold',
            fontSize: '2rem'
          }}>Direct Solution Entry</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Enter Question ID</label><br />
              <input
                type="number"
                value={questionId}
                onChange={e => setQuestionId(e.target.value)}
                style={{
                  width: '220px',
                  padding: '8px',
                  marginTop: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            {/* <button
              type="button"
              onClick={handleFetch}
              style={{
                marginTop: '28px',
                marginLeft: '8px',
                background: '#4caf50',
                color: 'white',
                padding: '8px 18px',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Fetch
            </button> */}
          </div>
          <div style={{
            display: 'flex',
            gap: '32px',
            marginBottom: '18px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Question for Reference</label><br />
              <textarea
                value={questionRef}
                onChange={e => setQuestionRef(e.target.value)}
                rows={8}
                style={{
                  width: '100%',
                  border: '1px solid #222',
                  borderRadius: '2px',
                  fontSize: '1rem',
                  marginTop: '8px',
                  resize: 'vertical'
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Solution Entry</label><br />
              <textarea
                value={solutionEntry}
                onChange={e => setSolutionEntry(e.target.value)}
                rows={8}
                style={{
                  width: '100%',
                  border: '1px solid #222',
                  borderRadius: '2px',
                  fontSize: '1rem',
                  marginTop: '8px',
                  resize: 'vertical'
                }}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Answer</label><br />
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={{
                width: '40%',
                padding: '8px',
                marginTop: '8px',
                borderRadius: '4px',
                border: '1px solid #222',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Check all options
            </label>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                background: '#57c3e8',
                color: '#222',
                padding: '10px 32px',
                border: '1px solid #222',
                borderRadius: '4px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={e => e.target.style.background = '#0099cc'}
              onMouseOut={e => e.target.style.background = '#57c3e8'}
            >
              SUBMIT
            </button>
          </div>
          {successMsg && (
            <div style={{ marginTop: '18px', color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
              {successMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SolutionEntryPage;