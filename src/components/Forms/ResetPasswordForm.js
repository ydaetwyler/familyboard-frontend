import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { Formik, Form } from 'formik'

import TextInput from './Utils/TextInput'
import { RESET_PASSWORD } from '../../utils/mutations'
import { validateResetPassword } from './Utils/validations'

const ResetPasswordForm = () => {
    const [userHash] = useState(useParams().hash)
    const [cookies, setCookie] = useCookies(['userToken'])
    const [fail, setFail] = useState(false)
    const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD, {
        onCompleted: (data) => setCookie('userToken', data.resetPassword, { 
            maxAge: (60*60*24),
            sameSite: false
        }),
        onError: () => setFail(true)
    })

    return (
        <div className="h-2/5 min-h-[430px] w-96 min-w-[300px] bg-white/[.13] absolute -translate-y-2/4 translate-x-2/4 top-2/4 right-2/4 rounded-md backdrop-blur-md border-2 border-white/[.1] shadow-xl shadow-gray-900/[.6] py-12 px-9 before:(p-0, m-0, box-border) after:(p-0, m-0, box-border) font-['Mulish']">
            <h3 className="mb-2 text-center text-4xl text-white font-medium leading-9">
                Set new password
            </h3>
            <Formik
                initialValues={{ password: '', passwordConfirm: '' }}
                validationSchema={validateResetPassword}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        resetPassword({ variables: { 
                            password: values.password,
                            userHash
                            } })
                        setSubmitting(false)
                    }, 400)
                }}
            >
                <Form>
                    <TextInput
                        className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-sm font-light text-white"
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        placeholder=""
                    />
                    <TextInput
                        className="mb-3 block h-12 w-full bg-white/[.07] rounded-sm px-2 mt-2 text-sm font-light text-white"
                        id="passwordConfirm"
                        label="Password confirmation"
                        name="passwordConfirm"
                        type="password"
                        placeholder=""
                    />
                    <button
                        className="mt-12 w-full bg-white text-black py-3 text-xl font-semibold rounded-sm cursor-pointer"
                        disabled={loading} 
                        type="submit"
                    >
                        Set password
                    </button>
                    {error && <p>{error.message}</p>}
                </Form>
            </Formik>
        </div>

    )
}

export default ResetPasswordForm