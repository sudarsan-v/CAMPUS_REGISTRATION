// import React, { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';

// const courses = [
//   'EAMCET', 'NEET', 'CIVILS', 'BITSAT', 'ASSESSMENT TESTS', 'APSSDC', 'KVPY', 'ENGINEERING',
//   'AIIMS', 'JIPMER', 'RRB', 'btch1', 'NTSE', 'JEE ADVANCED', 'JEE MAIN', 'NDA',
//   'Recruitment_1', 'medical', 'ICMR', 'FOUNDATION', 'GATE', 'JNV', 'SAINIK', 'Recruitment',
//   'RECRUITMENT', 'Course001'
// ];

// const grades = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// function ParagraphModificationPage() {
//   const [search, setSearch] = useState('');

//   return (
//     <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: 0 }}>
//       {/* Title Bar */}
//       <div style={{
//         background: '#377d98',
//         color: '#ffe066',
//         fontWeight: 'bold',
//         fontSize: '1.5rem',
//         padding: '12px 24px'
//       }}>
//         Paragraph Entry
//       </div>
//       {/* Breadcrumb */}
//       <div style={{ background: '#eaf6fb', color: '#377d98', fontSize: '1rem', padding: '8px 24px' }}>
//         Home &gt; Admissions &gt; Paragraphs
//       </div>
//       {/* Main Content */}
//       <div style={{ display: 'flex', padding: '24px' }}>
//         <div style={{ flex: 1 }}>
//           <h2 style={{ color: '#222', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>
//             Select Paragraph to change
//           </h2>
//           {/* Search Bar */}
//           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
//             <FaSearch style={{ marginRight: '8px', fontSize: '1.2rem', color: '#377d98' }} />
//             <input
//               type="text"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search"
//               style={{
//                 width: '250px',
//                 padding: '6px 10px',
//                 borderRadius: '4px',
//                 border: '1px solid #ccc',
//                 marginRight: '8px'
//               }}
//             />
//             <button
//               style={{
//                 padding: '6px 16px',
//                 background: '#eaf6fb',
//                 border: '1px solid #377d98',
//                 borderRadius: '4px',
//                 color: '#377d98',
//                 fontWeight: 'bold',
//                 cursor: 'pointer'
//               }}
//             >
//               Search
//             </button>
//           </div>
//           {/* Paragraphs List */}
//           <div style={{
//             background: '#fff',
//             borderRadius: '6px',
//             border: '1px solid #e0e0e0',
//             minHeight: '320px',
//             padding: '16px',
//             marginBottom: '16px'
//           }}>
//             <div style={{ color: '#888', fontSize: '1rem' }}>0 Paragraphs</div>
//             {/* Render paragraphs here */}
//           </div>
//         </div>
//         {/* Filter Sidebar */}
//         <div style={{
//           width: '220px',
//           marginLeft: '32px',
//           background: '#eaf6fb',
//           borderRadius: '6px',
//           border: '1px solid #cce3ee',
//           padding: '16px'
//         }}>
//           <div style={{ fontWeight: 'bold', color: '#377d98', marginBottom: '10px' }}>Filter</div>
//           <div style={{ marginBottom: '16px' }}>
//             <div style={{ fontWeight: 'bold', color: '#222', marginBottom: '6px' }}>By course</div>
//             <div style={{ color: '#377d98', cursor: 'pointer', marginBottom: '4px' }}>All</div>
//             {courses.map(course => (
//               <div key={course} style={{ color: '#222', cursor: 'pointer', marginBottom: '4px', fontSize: '0.95rem' }}>
//                 {course}
//               </div>
//             ))}
//           </div>
//           <div>
//             <div style={{ fontWeight: 'bold', color: '#222', marginBottom: '6px' }}>By Grade Class</div>
//             <div style={{ color: '#377d98', cursor: 'pointer', marginBottom: '4px' }}>All</div>
//             {grades.map(grade => (
//               <div key={grade} style={{ color: '#222', cursor: 'pointer', marginBottom: '4px', fontSize: '0.95rem' }}>
//                 {grade}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ParagraphModificationPage;

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const courses = [
  'EAMCET', 'NEET', 'CIVILS', 'BITSAT', 'ASSESSMENT TESTS', 'APSSDC', 'KVPY', 'ENGINEERING',
  'AIIMS', 'JIPMER', 'RRB', 'btch1', 'NTSE', 'JEE ADVANCED', 'JEE MAIN', 'NDA',
  'Recruitment_1', 'medical', 'ICMR', 'FOUNDATION', 'GATE', 'JNV', 'SAINIK', 'Recruitment',
  'RECRUITMENT', 'Course001'
];

const grades = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function ParagraphModificationPage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: 0 }}>
      {/* Title Bar */}
      <div style={{
        background: '#377d98',
        color: '#ffe066',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        padding: '12px 24px'
      }}>
        Paragraph Entry
      </div>
      {/* Breadcrumb */}
      <div style={{ background: '#eaf6fb', color: '#377d98', fontSize: '1rem', padding: '8px 24px' }}>
        Home &gt; Admissions &gt; Paragraphs
      </div>
      {/* Main Content */}
      <div style={{ display: 'flex', padding: '24px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#222', fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>
            Select Paragraph to change
          </h2>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <FaSearch style={{ marginRight: '8px', fontSize: '1.2rem', color: '#377d98' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              style={{
                width: '250px',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginRight: '8px'
              }}
            />
            <button
              style={{
                padding: '6px 16px',
                background: '#eaf6fb',
                border: '1px solid #377d98',
                borderRadius: '4px',
                color: '#377d98',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
          {/* Paragraphs List */}
          <div style={{
            background: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0',
            minHeight: '320px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ color: '#888', fontSize: '1rem' }}>0 Paragraphs</div>
            {/* Render paragraphs here */}
          </div>
        </div>
        {/* Filter Sidebar */}
        <div style={{
          width: '220px',
          marginLeft: '32px',
          background: '#eaf6fb',
          borderRadius: '6px',
          border: '1px solid #cce3ee',
          padding: '16px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#377d98', marginBottom: '10px' }}>Filter</div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', color: '#222', marginBottom: '6px' }}>By course</div>
            <div style={{ color: '#377d98', cursor: 'pointer', marginBottom: '4px' }}>All</div>
            {courses.map(course => (
              <div key={course} style={{ color: '#222', cursor: 'pointer', marginBottom: '4px', fontSize: '0.95rem' }}>
                {course}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#222', marginBottom: '6px' }}>By Grade Class</div>
            <div style={{ color: '#377d98', cursor: 'pointer', marginBottom: '4px' }}>All</div>
            {grades.map(grade => (
              <div key={grade} style={{ color: '#222', cursor: 'pointer', marginBottom: '4px', fontSize: '0.95rem' }}>
                {grade}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParagraphModificationPage;