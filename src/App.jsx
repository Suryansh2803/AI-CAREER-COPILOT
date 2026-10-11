import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'

// Dashboard pages
import DashboardPage from './pages/DashboardPage'
import CareerTwinPage from './pages/CareerTwinPage'
import CareerRoadmapPage from './pages/CareerRoadmapPage'
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage'
import JobMatchPage from './pages/JobMatchPage'
import MockInterviewPage from './pages/MockInterviewPage'
import MentorPage from './pages/MentorPage'
import PlannerPage from './pages/PlannerPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import CareerSimulatorPage from './pages/CareerSimulatorPage'

// Utility
import NotFoundPage from './pages/NotFoundPage'

import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public Routes ─── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* ─── Dashboard Routes ─── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/career-twin" element={<CareerTwinPage />} />
          <Route path="/simulator" element={<CareerSimulatorPage />} />
          <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/job-match" element={<JobMatchPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* ─── Fallbacks ─── */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
