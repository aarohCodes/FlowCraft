import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tools } from './pages/Tools';
import { Education } from './pages/Education';
import { Email } from './pages/Email';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Timer } from './pages/Timer';
import { AddTask } from './pages/AddTask';
import { CreateFlashcard } from './pages/CreateFlashcard';
import { Landing } from './pages/Landing';
import { ZoomDashboard } from './pages/ZoomDashboard';
import { ZoomCallback } from './components/Zoom/ZoomCallback';
import { VideoMeetingCallback } from './components/VideoMeeting/VideoMeetingCallback';
import { GmailCallback } from './components/Email/GmailCallback';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './hooks/useAuth';
import { useDatabase } from './hooks/useDatabase';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { loading: dbLoading } = useDatabase();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCreateFlashcard, setShowCreateFlashcard] = useState(false);

  const handleLogout = async () => {
    const { signOut } = await import('./hooks/useAuth');
    await signOut();
    window.location.href = '/';
  };

  // Listen for navigation events from paywall
  useEffect(() => {
    const handleNavigateToEmail = () => {
      setActiveSection('email');
    };

    const handleNavigateToEducation = () => {
      setActiveSection('education');
    };

    const handleNavigateToTools = () => {
      setActiveSection('tools');
    };

    window.addEventListener('navigate-to-email', handleNavigateToEmail);
    window.addEventListener('navigate-to-education', handleNavigateToEducation);
    window.addEventListener('navigate-to-tools', handleNavigateToTools);

    return () => {
      window.removeEventListener('navigate-to-email', handleNavigateToEmail);
      window.removeEventListener('navigate-to-education', handleNavigateToEducation);
      window.removeEventListener('navigate-to-tools', handleNavigateToTools);
    };
  }, []);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading FlowCraft...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your workspace
          </p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing onLogin={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  const renderContent = () => {
    if (showTimer) {
      return <Timer onBack={() => setShowTimer(false)} />;
    }

    if (showAddTask) {
      return <AddTask onBack={() => setShowAddTask(false)} />;
    }

    if (showCreateFlashcard) {
      return <CreateFlashcard onBack={() => setShowCreateFlashcard(false)} />;
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onStartTimer={() => setShowTimer(true)} onAddTask={() => setShowAddTask(true)} onCreateFlashcard={() => setShowCreateFlashcard(true)} />;
      case 'tools':
        return <Tools />;
      case 'education':
        return <Education />;
      case 'email':
        return <Email />;
      case 'zoom':
        return <ZoomDashboard />;
      case 'transcripts':
        return <ZoomDashboard />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Dashboard onStartTimer={() => setShowTimer(true)} onAddTask={() => setShowAddTask(true)} onCreateFlashcard={() => setShowCreateFlashcard(true)} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Routes>
          {/* Auth callback routes */}
          <Route path="/zoom/callback" element={<ZoomCallback />} />
          <Route path="/video-meeting/callback/:platform" element={<VideoMeetingCallback />} />
          <Route path="/gmail/callback" element={<GmailCallback />} />
          
          {/* Main app routes */}
          <Route path="*" element={
            <>
              {!showTimer && !showAddTask && !showCreateFlashcard && (
                <>
                  <Header 
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onLogout={handleLogout}
                  />
                  
                  <div className="flex pt-16">
                    <Sidebar
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      isCollapsed={isSidebarCollapsed}
                      setIsCollapsed={setIsSidebarCollapsed}
                      isMobileMenuOpen={isMobileMenuOpen}
                    />
                    <main
                      className="flex-1 p-6 lg:p-8 min-w-0 transition-all duration-300"
                      style={{ marginLeft: isSidebarCollapsed ? '5rem' : '18rem' }}
                    >
                      <div className="w-full mx-auto">
                        {renderContent()}
                      </div>
                    </main>
                  </div>
                </>
              )}

              {(showTimer || showAddTask || showCreateFlashcard) && renderContent()}
            </>
          } />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1f2937',
              border: '1px solid rgba(209, 213, 219, 0.8)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: 'rgba(34, 197, 94, 0.95)',
                color: '#ffffff',
                border: '1px solid rgba(34, 197, 94, 0.8)',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#22c55e',
              },
            },
            error: {
              style: {
                background: 'rgba(239, 68, 68, 0.95)',
                color: '#ffffff',
                border: '1px solid rgba(239, 68, 68, 0.8)',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;