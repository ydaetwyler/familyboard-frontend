import React from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import Particles from 'react-tsparticles'

import UserAccessForm from '../Forms/UserAccessForm'
import NewUserAccessForm from '../Forms/NewUserAccessForm'
import NewFamilyForm from '../Forms/NewFamilyForm'
import LostPasswordForm from '../Forms/LostPasswordForm'
import ResetPasswordForm from '../Forms/ResetPasswordForm'

const Login = () => {

    return (
        <div className="w-full h-screen">
            <Particles id="tsparticles" url="/particles.json"/>
            <BrowserRouter>
                <Routes>
                    <Route path='/login/:hash' element={<NewUserAccessForm />} />
                    <Route path='/reset/:hash' element={<ResetPasswordForm />} />
                    <Route path='/new' element={<NewFamilyForm />} />
                    <Route path='/lost' element={<LostPasswordForm />} />
                    <Route exact path='/' element={<UserAccessForm />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Login