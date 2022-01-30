import React from 'react'
import { useCookies } from 'react-cookie'

import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'

const App = () => {
  const [cookies] = useCookies(['accessGranted'])

  if (!cookies.accessGranted) return <Login />

  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App
