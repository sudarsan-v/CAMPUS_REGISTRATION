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
import CumulativePerformancePage from './pages/CumulativePerformancePage';
import ErrorListPage from './pages/ErrorListPage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import ReasonsForWrongAttemptPage from './pages/ReasonsForWrongAttemptPage';
import ReasonWiseCountPage from './pages/ReasonWiseCountPage';
import PracticeWrongUnattemptedPage from './pages/PracticeWrongUnattemptedPage';
import TimeTakenPage from './pages/TimeTakenPage';
import QuestionPaperWeightagePage from './pages/QuestionPaperWeightagePage';
import ProgressReportPage from './pages/ProgressReportPage';

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
        <Route path="/change-password" element={<><Header /><ChangePasswordPage /></>} />
        {/* <Route path="/add-paragraph" element={<><Header /><Navigation /><AddParagraphPage /></>} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-campus" element={<><Header /><Navigation /><AddCampusPage /></>} />
        <Route path="/edit-campus/:id" element={<><Header /><Navigation /><EditCampusPage /></>} />
        <Route path="/take-test" element={<TakeOnlineTest />} />
        <Route path="/exam-info/:testId" element={<ExamInfo />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/cumulative-performance" element={<CumulativePerformancePage />} />
        <Route path="/error-list" element={<ErrorListPage />} />
        <Route path="/reasons-wrong-attempt/:questionId" element={<ReasonsForWrongAttemptPage />} />
        <Route path="/reason-wise-count" element={<ReasonWiseCountPage />} />
        <Route path="/practice-wrong-unattempted" element={<PracticeWrongUnattemptedPage />} />
        <Route path="/time-taken" element={<TimeTakenPage />} />
        <Route path="/question-paper-weightage" element={<QuestionPaperWeightagePage />} />
        <Route path="/progress-report" element={<ProgressReportPage />} />
        <Route path="/notifications" element={<><Header /><NotificationsPage /></>} />
        <Route path="/notifications/:id" element={<><Header /><NotificationDetailPage /></>} />
        </Routes>
    </Router>
  );
}

export default App;