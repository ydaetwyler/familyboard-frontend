import React from 'react'
import AuthError from './AuthError'
import ForbiddenError from './ForbiddenError'
import GenericError from './GenericError'

const CheckError = ({ error }) => {
    if (error) {
        console.log(error)
        if ('message' in error) {
            if (error.message == 'Login necessary') return <AuthError />
            if (error.message == 'Session invalid') return <AuthError />
            if (error.message == 'Forbidden') return <ForbiddenError />
            return <GenericError errorMessage={error} />
        } else {
            return <GenericError errorMessage={error} />
        }
    }
}

export default CheckError
