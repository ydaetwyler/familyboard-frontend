import React from 'react'

import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'

const App = () => {
  if (localStorage.getItem('accessGranted') != 'yes') return <Login />

  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App
