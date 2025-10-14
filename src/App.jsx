import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Header from './pages/Header';
import Navigation from './pages/Navigation';
import CampusPage from './pages/CampusPage';
import SelectionPage from './pages/SelectionPage';
import QuestionEntryPage from './pages/QuestionEntryPage';
import NewQuestionFormPage from './pages/NewQuestionFormPage';
import SolutionEntryPage from './pages/SolutionEntryPage';
import QuestionChangePage from './pages/QuestionChangePage';
import ParagraphModificationPage from './pages/ParagraphModificationPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import AddCampusPage from './pages/AddCampusPage';
import EditCampusPage from './pages/EditCampusPage';
import TakeOnlineTest from './pages/TakeOnlineTest';
import ExamInfo from './pages/ExamInfo';
import ReportsPage from './pages/ReportsPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/campus" element={<><Header /><Navigation /><CampusPage /></>} />
        <Route path="/selection" element={<><Header /><Navigation /><SelectionPage /></>} />
        <Route path="/question-entry" element={<><Header /><Navigation /><QuestionEntryPage /></>} />
        <Route path="/new-question-form" element={<><Header /><Navigation /><NewQuestionFormPage /></>} />
        <Route path="/solution-entry" element={<><Header /><Navigation /><SolutionEntryPage /></>} />
        <Route path="/question-change" element={<><Header /><Navigation /><QuestionChangePage /></>} />
        <Route path="/paragraph-modification" element={<><Header /><Navigation /><ParagraphModificationPage /></>} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        {/* <Route path="/add-paragraph" element={<><Header /><Navigation /><AddParagraphPage /></>} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-campus" element={<><Header /><Navigation /><AddCampusPage /></>} />
        <Route path="/edit-campus/:id" element={<><Header /><Navigation /><EditCampusPage /></>} />
        <Route path="/take-test" element={<TakeOnlineTest />} />
        <Route path="/exam-info/:testId" element={<ExamInfo />} />
        <Route path="/reports" element={<ReportsPage />} />
        </Routes>
    </Router>
  );
}

export default App;