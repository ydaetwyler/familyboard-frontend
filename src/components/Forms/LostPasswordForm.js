import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { Link } from 'react-router-dom'

import TextInput from './Utils/TextInput'
import { LOST_PASSWORD } from '../../utils/mutations'
import { validateLostPassword } from './Utils/validations'

const LostPasswordForm = () => {
    const [sent, setSent] = useState(false)
    const [mailto, setMailto] = useState('')
    const [lostPassword, { loading, error }] = useMutation(LOST_PASSWORD, {
        onCompleted: () => setSent(true),
        onError: () => setSent(true)
    })

    if (sent) return (
        <div>
            <p>Reset link sent to {mailto} (if user exists)</p>
            <p>Please check your mailbox</p>
        </div>
    )

    return (
        <div className="h-2/5 min-h-[430px] w-96 min-w-[300px] bg-white/[.13] absolute -translate-y-2/4 translate-x-2/4 top-2/4 right-2/4 rounded-md backdrop-blur-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish']">
            <h3 className="mb-2 text-center text-4xl text-white font-medium leading-9">
                Reset password
            </h3>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validateLostPassword}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        setMailto(values.email)
                        lostPassword({ variables: { email: values.email } })
                        setSubmitting(false)
                    }, 400)
                }}
            >
                <Form>
                    <TextInput
                        className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-sm font-light text-white"
                        id="email"
                        label="E-Mail"
                        name="email"
                        type="text"
                        placeholder=""
                    />
                    <button
                        className="mt-12 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer" 
                        disabled={loading} 
                        type="submit"
                    >
                        Send reset link
                    </button>
                </Form>
            </Formik>
            <div className="mt-6 flex flex-row justify-between">
                <Link to="/">Back to login</Link>
            </div>
        </div>
    )
}

export default LostPasswordForm