import * as Yup from 'yup'
import { stringToDate } from '../../../utils/dateHelpers'

export const validateLostPassword = Yup.object({
    email: Yup.string()
        .max(40, 'Must be 40 characters or less')
        .required('Required')
        .email('Invalid email')
})

export const validateNewFamily = Yup.object({
    familyName: Yup.string()
        .trim()
        .max(15, 'Must be 15 characters or less')
        .required('Required')
        .matches(/^[a-zA-Z\x7f-\xff]+$/, 'Only alphates are allowed')
})

export const validateNewUserAccess = Yup.object({
    email: Yup.string()
        .trim()
        .max(40, 'Must be 40 characters or less')
        .required('Required')
        .email('Invalid email'),
    username: Yup.string()
        .trim()
        .max(18, 'Must be 18 characters or less')
        .required('Required')
        .matches(/^[a-zA-Z\x7f-\xff]+$/, 'Only alphates are allowed'),
    password: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .min(8, 'Password has to be 8 characters or more')
        .required('Required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must contain 8 characters or more, one uppercase, one lowercase, one number and one special case character"
        ),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password confirmation does not match')
})

export const validateResetPassword= Yup.object({
    password: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .min(8, 'Password has to be 8 characters or more')
        .required('Required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must contain 8 characters or more, one uppercase, one lowercase, one number and one special case character"
        ),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password confirmation does not match')
})

export const validateUserAccess = Yup.object({
    email: Yup.string()
        .trim()
        .required('Required')
        .email('Invalid email'),
    password: Yup.string()
        .required('Required')
})

export const validateUserUpdate = Yup.object({
    username: Yup.string()
        .trim()
        .max(18, 'Must be 18 characters or less')
        .required('Required')
        .matches(/^[a-zA-Z\x7f-\xff]+$/, 'Only alphates are allowed')
})

export const validateEmail = Yup.object({
    email: Yup.string()
        .trim()
        .max(40, 'Must be 40 characters or less')
        .required('Required')
        .email('Invalid email')
})

const isValidUrl = url => {
    try {
        new URL(url)
    } catch (e) {
        return false
    }
    return true
}

export const validateEvent = Yup.object({
    activityName: Yup.string()
        .trim()
        .max(18, 'Must be 18 characters or less')
        .required('Required'),
    activityDescription: Yup.string()
        .trim()
        .max(250, 'Must be 250 characters or less'),
    activityDate: Yup.string()
        .trim()
        .required('Required')
        .matches(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/, 'Date must be dd.mm.yyyy')
        .test(
            "is-date-future", 
            "Date must be today or in the future",
            date => new Date(stringToDate(date)).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)
        )
        ,
    activityLocation: Yup.string()
        .trim()
        .max(25, 'Must be 25 characters or less')
        .required('Required')
        .matches(/^[a-zA-Z\x7f-\xff]+$/, 'Only alphates are allowed'),
    activityAddress: Yup.string()
        .trim()
        .max(25, 'Must be 25 characters or less')
        .matches(/^[A-Za-z\x7f-\xff0-9 _]*[A-Za-z\x7f-\xff0-9][A-Za-z\x7f-\xff0-9 _]*$/, 'Only alphates and numbers are allowed'),
    activityUrl: Yup.string()
        .trim()
        .max(50, 'Must be 50 characters or less')
        .test("is-url-valid", "URL is not valid", value => value ? isValidUrl(value) : true)
})

export const validateComment = Yup.object({
    commentText: Yup.string()
        .trim()
        .required('')
        .max(75, 'Must be 75 characters or less')
})