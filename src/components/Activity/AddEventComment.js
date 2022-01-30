import React from 'react'
import { Formik, Form } from 'formik'
import { useMutation } from '@apollo/client'

import { validateComment } from '../Forms/Utils/validations'
import TextArea from '../Forms/Utils/TextArea'

import CheckError from '../Errors/CheckError'

import { CREATE_EVENT_COMMENT } from '../../utils/mutations'

const AddEventComment = ({ id }) => {
    const [createEventComment, { loading, error }] = useMutation(CREATE_EVENT_COMMENT)

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    
    if (error) return <CheckError error={error} />

    return (
        <div>
            <Formik
                initialValues={{ 
                    commentText: '',
                }}
                validationSchema={validateComment}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => {
                        createEventComment({ variables: { 
                            _id: id,
                            commentText: values.commentText    
                        } })
                        setSubmitting(false)
                        resetForm({ values: '' })
                    }, 400)
                }}
            >
                <Form className="mt-3 flex flex-row flex-nowrap justify-center items-end">
                    <TextArea
                        className="block px-2 mr-4 w-3/4 bg-white/[.07] rounded-sm text-base font-light text-white"
                        id="commentText"
                        name="commentText"
                        rows="2"
                        placeholder=""
                    />
                    <button
                        className="block w-16 h-12 bg-white text-black text-base font-normal rounded-sm cursor-pointer" 
                        disabled={loading} 
                        type="submit"
                    >
                    Add
                    </button>
                    {error && <p>{error.message}</p>}
                </Form>
            </Formik>
        </div>
    )
}

export default AddEventComment