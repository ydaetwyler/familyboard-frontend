import React from 'react'
import { useField } from 'formik'

const TextArea = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    
    return (
        <>
            <label className="block text-base font-medium text-white" htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

export default TextArea