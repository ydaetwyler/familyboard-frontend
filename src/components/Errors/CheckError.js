import React from 'react'
import AuthError from './AuthError'
import ForbiddenError from './ForbiddenError'
import GenericError from './GenericError'

const CheckError = ({ error }) => {
    if (error) {
        if ('message' in error) {
            if (error.message == 'Login necessary') return <AuthError />
            if (error.message == 'Session invalid') return <AuthError />
            if (error.message == 'Forbidden') return <ForbiddenError />
            return <GenericError />
        } else {
            return <GenericError />
        }
    }
}

export default CheckError
