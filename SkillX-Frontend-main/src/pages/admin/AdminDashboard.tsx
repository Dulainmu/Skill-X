import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CareerPaths from './CareerPaths';
import Skills from './Skills';
import Materials from './Materials';
import Quizzes from './Quizzes';
import Projects from './Projects';
import Users from './Users';
import { Card } from '@/components/ui/card';
import { getApiUrl } from '@/config/api';

const isAdmin = () => {
  return localStorage.getItem('skillx-role') === 'admin';
};

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    users: 0,
    completions: 0,
    avgQuizScore: 0,
    avgProjectScore: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('skillx-token');
        const res = await fetch(getApiUrl('/api/users/admin/analytics'), {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch analytics (${res.status})`);
        const data = await res.json();
        setAnalytics(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="p-10 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Unauthorized</h1>
          <p className="text-gray-700">You must be an admin to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white flex flex-col p-6 min-h-screen shadow-lg">
        <div className="text-2xl font-bold mb-8 tracking-wide text-center">Skill-X Admin</div>
        <nav className="flex flex-col gap-2">
          <Link to="/admin/career-paths" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Career Paths</Link>
          <Link to="/admin/skills" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Skills</Link>
          <Link to="/admin/materials" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Learning Materials</Link>
          <Link to="/admin/quizzes" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Quizzes</Link>
          <Link to="/admin/projects" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Projects</Link>
          <Link to="/admin/users" className="hover:bg-blue-900 rounded px-3 py-2 transition-colors">Users</Link>
        </nav>
        <div className="mt-auto pt-8 border-t border-blue-900 text-sm text-center">Logged in as Admin</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Analytics Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Analytics & Reporting</h2>
            {loading ? (
              <div className="text-center py-10 text-lg">Loading analytics...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                <Card className="rounded-lg p-6 text-center bg-blue-50 border-0 shadow-sm">
                  <div className="text-3xl font-bold text-blue-700">{analytics.users}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Users</div>
                </Card>
                <Card className="rounded-lg p-6 text-center bg-green-50 border-0 shadow-sm">
                  <div className="text-3xl font-bold text-green-700">{analytics.completions}</div>
                  <div className="text-xs text-gray-500 mt-1">Completions</div>
                </Card>
                <Card className="rounded-lg p-6 text-center bg-yellow-50 border-0 shadow-sm">
                  <div className="text-3xl font-bold text-yellow-700">{analytics.avgQuizScore}%</div>
                  <div className="text-xs text-gray-500 mt-1">Avg Quiz Score</div>
                </Card>
                <Card className="rounded-lg p-6 text-center bg-purple-50 border-0 shadow-sm">
                  <div className="text-3xl font-bold text-purple-700">{analytics.avgProjectScore}%</div>
                  <div className="text-xs text-gray-500 mt-1">Avg Project Score</div>
                </Card>
                <Card className="rounded-lg p-6 text-center bg-indigo-50 border-0 shadow-sm">
                  <div className="text-3xl font-bold text-indigo-700">{analytics.activeToday}</div>
                  <div className="text-xs text-gray-500 mt-1">Active Today</div>
                </Card>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <Routes>
              <Route path="career-paths" element={<CareerPaths />} />
              <Route path="skills" element={<Skills />} />
              <Route path="materials" element={<Materials />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="projects" element={<Projects />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={
                <>
                  <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                  <p className="text-lg text-gray-700">Welcome to the Skill-X Admin Panel. Use the sidebar to manage career paths, skills, learning materials, quizzes, projects, and users.</p>
                </>
              } />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
