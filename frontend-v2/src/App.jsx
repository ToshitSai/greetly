import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AnimatedBackground from './components/AnimatedBackground'
import AnimatedRoutes from './components/AnimatedRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { CookieConsent } from './components/ui/CookieConsent'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen w-full overflow-hidden bg-brand-red text-brand-black">
          <AnimatedBackground />
          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <AnimatedRoutes />
          </div>
          <CookieConsent />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
