import React, { useState } from "react";
// For rich text editing, use react-quill or similar library.
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddParagraph() {
  const [course, setCourse] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [subject, setSubject] = useState("");
  const [mainTopic, setMainTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [paragraph, setParagraph] = useState("");

  return (
    <div style={{ padding: "32px", background: "#FFF9E5", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "24px" }}>Add Paragraph</h1>
      <div style={{ border: "1px solid #cbd6e2", padding: "24px", background: "#f7fafd" }}>
        <h2>Summary</h2>
        <form>
          <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
            <select value={course} onChange={e => setCourse(e.target.value)}>
              <option value="">Course</option>
              {/* Add course options here */}
            </select>
            <select value={gradeClass} onChange={e => setGradeClass(e.target.value)}>
              <option value="">Grade Class</option>
              {/* Add grade class options here */}
            </select>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">Subject</option>
              {/* Add subject options here */}
            </select>
            <select value={mainTopic} onChange={e => setMainTopic(e.target.value)}>
              <option value="">Main Topic</option>
              {/* Add main topic options here */}
            </select>
            <select value={subTopic} onChange={e => setSubTopic(e.target.value)}>
              <option value="">Sub Topic</option>
              {/* Add sub topic options here */}
            </select>
          </div>
          <h2>Question</h2>
          <div style={{ marginBottom: "16px" }}>
            <ReactQuill
              value={paragraph}
              onChange={setParagraph}
              placeholder="Enter your paragraph here"
              theme="snow"
              style={{ height: "200px" }}
            />
          </div>
          <button type="submit" style={{ marginTop: "16px" }}>Submit</button>
        </form>
      </div>
    </div>
  );
}