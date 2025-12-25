import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { NewMeasurement } from './pages/NewMeasurement'
import { MeasurementDetail } from './pages/MeasurementDetail'
import { NewContract } from './pages/NewContract'
import { Works } from './pages/Works'
import { RealizedMeasurements } from './pages/RealizedMeasurements'
import { Suppliers } from './pages/Suppliers'

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Layout>{children}</Layout>
}

const AppRoutes = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bgMain">
        <div className="text-textMain">Carregando...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-contract"
        element={
          <ProtectedRoute>
            <NewContract />
          </ProtectedRoute>
        }
      />

      <Route
        path="/works"
        element={
          <ProtectedRoute>
            <Works />
          </ProtectedRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-measurement"
        element={
          <ProtectedRoute>
            <NewMeasurement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/realized-measurements"
        element={
          <ProtectedRoute>
            <RealizedMeasurements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/measurement/:id"
        element={
          <ProtectedRoute>
            <MeasurementDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
