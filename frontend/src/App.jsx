import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Candidate Pages
import TestListPage from './pages/candidate/TestListPage';
import TestInstructionsPage from './pages/candidate/TestInstructionsPage';
import ExamPage from './pages/candidate/ExamPage';
import ResultsPage from './pages/candidate/ResultsPage';
import AttemptHistoryPage from './pages/candidate/AttemptHistoryPage';
import PerformanceAnalyticsPage from './pages/candidate/PerformanceAnalyticsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTestsPage from './pages/admin/AdminTestsPage';
import AdminCreateTestPage from './pages/admin/AdminCreateTestPage';
import AdminEditTestPage from './pages/admin/AdminEditTestPage';
import AdminQuestionBankPage from './pages/admin/AdminQuestionBankPage';
import AdminBulkImportPage from './pages/admin/AdminBulkImportPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tests" element={<TestListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Exam & Results Routes */}
          <Route path="/test/:id/instructions" element={<TestInstructionsPage />} />
          <Route path="/exam/:id" element={<ExamPage />} />
          <Route path="/results/:attemptId" element={<ResultsPage />} />

          {/* Candidate Protected Routes */}
          <Route
            path="/attempts"
            element={
              <ProtectedRoute>
                <AttemptHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <PerformanceAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute adminOnly>
                <AdminTestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests/create"
            element={
              <ProtectedRoute adminOnly>
                <AdminCreateTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminEditTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute adminOnly>
                <AdminQuestionBankPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions/import"
            element={
              <ProtectedRoute adminOnly>
                <AdminBulkImportPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
