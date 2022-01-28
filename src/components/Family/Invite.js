import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'

import TextInput from '../Forms/Utils/TextInput'
import { INVITE } from '../../utils/mutations'
import { validateEmail} from '../Forms/Utils/validations'

import AuthError from '../Errors/AuthError'
import ForbiddenError from '../Errors/ForbiddenError'

const Invite = ({ familyID }) => {
    const [fail, setFail] = useState(false)

    const [invite, { loading, error }] = useMutation(INVITE, {
        onError: () => setFail(true)
    })

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    
    if (error) {
        if (error.errors[0].extensions.code == 'UNAUTHENTICATED') return <AuthError />
        if (error.errors[0].extensions.code == 'FORBIDDEN') return <ForbiddenError />
    }

    return (
        <div>
            <h3 className="mt-8 mb-2 text-center text-4xl text-white font-medium leading-9">
                Invite
            </h3>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validateEmail}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        invite({ variables: { 
                            _id: familyID,
                            email: values.email,
                            } })
                        setSubmitting(false)
                    }, 400)
                }}
            >
                <Form>
                    <TextInput
                        className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-base font-medium text-white"
                        id="email"
                        label="E-Mail"
                        name="email"
                        type="text"
                        placeholder=""
                    />
                    <button
                        className="mt-6 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer" 
                        disabled={loading} 
                        type="submit"
                    >
                        Send invitation
                    </button>
                    {error && <p>{error.message}</p>}
                </Form>
            </Formik>
        </div>
    )
}

export default Invite