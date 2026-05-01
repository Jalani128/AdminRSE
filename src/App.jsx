import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeamPage from './pages/AdminTeamPage';
import AdminBlogsPage from './pages/AdminBlogsPage';
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import AdminInquiryDetailPage from './pages/AdminInquiryDetailPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#2E3192] flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminPrivateRoute />}>
       <Route element={<AdminLayout />}>
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/team" element={<AdminTeamPage />} />
         <Route path="/admin/blogs" element={<AdminBlogsPage />} />
         <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
         <Route path="/admin/inquiries/:id" element={<AdminInquiryDetailPage />} />
       </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;