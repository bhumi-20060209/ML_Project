import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

import { Dashboard } from '../pages/Dashboard';
import { Prediction } from '../pages/Prediction';
import { Models } from '../pages/Models';
import { Analytics } from '../pages/Analytics';
import { PredictionHistory } from '../pages/PredictionHistory';
import { Dataset } from '../pages/Dataset';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';

const Layout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/prediction"
        element={
          <ProtectedRoute>
            <Layout title="Prediction">
              <Prediction />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/models"
        element={
          <ProtectedRoute>
            <Layout title="Models">
              <Models />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout title="Analytics">
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout title="Prediction History">
              <PredictionHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataset"
        element={
          <ProtectedRoute>
            <Layout title="Dataset Explorer">
              <Dataset />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout title="Settings">
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
