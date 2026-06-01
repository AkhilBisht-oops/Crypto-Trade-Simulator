import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import TradeHistory from './pages/TradeHistory';
import Watchlist from './pages/Watchlist';
import Leaderboard from './pages/Leaderboard';

// Components
import Navbar from './components/Navbar';
import LiveTicker from './components/LiveTicker';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <div className="min-h-screen bg-dark-950 text-white flex flex-col font-sans">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Global Live Price Ticker */}
        {isAuthenticated && <LiveTicker />}

        {/* Main Navbar */}
        {isAuthenticated && <Navbar />}

        {/* Routes Area */}
        <main className={`flex-1 ${isAuthenticated ? 'max-w-[1920px] w-full mx-auto p-4 sm:p-6' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

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
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <TradeHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

