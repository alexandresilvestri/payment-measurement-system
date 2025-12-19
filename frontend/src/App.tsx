import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { DirectorDashboard } from './pages/DirectorDashboard'
import { SiteDashboard } from './pages/SiteDashboard'
import { NewMeasurement } from './pages/NewMeasurement'
import { MeasurementDetail } from './pages/MeasurementDetail'
import { NewContract } from './pages/NewContract'
import { Works } from './pages/Works'
import { RealizedMeasurements } from './pages/RealizedMeasurements'

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children?: React.ReactNode
  requiredRole?: 'DIRETOR' | 'OBRA'
}) => {
  const { currentUser } = useAppContext()

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to their appropriate dashboard if role mismatch
    return (
      <Navigate
        to={currentUser.role === 'DIRETOR' ? '/director' : '/site'}
        replace
      />
    )
  }

  return <Layout>{children}</Layout>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Director Routes */}
      <Route
        path="/director"
        element={
          <ProtectedRoute requiredRole="DIRETOR">
            <DirectorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Site User Routes */}
      <Route
        path="/site"
        element={
          <ProtectedRoute requiredRole="OBRA">
            <SiteDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
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
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  )
}

export default App
