import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'

import TextInput from '../Forms/Utils/TextInput'
import { INVITE } from '../../utils/mutations'
import { validateEmail} from '../Forms/Utils/validations'

const Invite = ({ familyID }) => {
    const [fail, setFail] = useState(false)

    const [invite, { loading, error }] = useMutation(INVITE, {
        onError: () => setFail(true)
    })

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return JSON.stringify(error, null, 2)

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