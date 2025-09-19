import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HerbCollection from "./pages/HerbCollection";
import QualityTesting from "./pages/QualityTesting";
import Processing from "./pages/Processing";
import TraceHerb from "./pages/TraceHerb";
import Profile from "./pages/Profile";
import HerbDetails from "./pages/HerbDetails";
import AdminPanel from "./pages/AdminPanel";
import "./index.css";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
}

// Public Route Component (redirect to dashboard if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/trace" element={<TraceHerb />} />
          <Route path="/trace/:herbId" element={<TraceHerb />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/herb/:herbId"
            element={
              <ProtectedRoute>
                <HerbDetails />
              </ProtectedRoute>
            }
          />

          {/* Role-specific Routes */}
          <Route
            path="/collect"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <HerbCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quality-test"
            element={
              <ProtectedRoute allowedRoles={["LAB"]}>
                <QualityTesting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/process"
            element={
              <ProtectedRoute allowedRoles={["PROCESSOR"]}>
                <Processing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-cream-50">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    404 - Page Not Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="bg-mint-500 text-white px-6 py-2 rounded-lg hover:bg-mint-600 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
