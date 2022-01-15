import { gql } from '@apollo/client'

export const LOST_PASSWORD = gql`
mutation LostPassword($email: String!) {
    lostPassword(email: $email)
}
`

export const CREATE_FAMILY = gql`
    mutation CreateFamily($familyName: String!, $familyAvatarUrl: String!) {
        createFamily(familyName: $familyName, familyAvatarUrl: $familyAvatarUrl)
    }
`

export const SIGN_UP = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!, $userHash: String!, $avatarUrl: String!) {
        signUp(username: $username, email: $email, password: $password, userHash: $userHash, avatarUrl: $avatarUrl)
    }
`

export const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $userHash: String!) {
        resetPassword(password: $password, userHash: $userHash)
    }
`

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
    }
`

export const UPDATE_USER = gql`
    mutation UpdateUser($username: String!, $avatarUrl: String!) {
        updateUser(username: $username, avatarUrl: $avatarUrl) {
            userName,
            avatarUrl
        }
    }
`

export const SELECT_BG = gql`
    mutation SelectBg($selectedBgValue: String, $selectedBgLabel: String) {
        selectBg(selectedBgValue: $selectedBgValue, selectedBgLabel: $selectedBgLabel)
    }
`

export const UPDATE_FAMILY = gql`
    mutation UpdateFamily($_id: ID, $familyName: String!, $familyAvatarUrl: String!) {
        updateFamily(_id: $_id, familyName: $familyName, familyAvatarUrl: $familyAvatarUrl) {
            _id,
            familyName,
            familyAvatarUrl
        }
    }
`

export const INVITE = gql`
    mutation Invite($_id: ID, $email: String!) {
        invite(_id: $_id, email: $email)
    }
`

export const SET_COORDINATES = gql`
    mutation SetCoordinates($_id: ID, $activityCoordinates: String, $activityApiCityNotFound: Boolean) {
        setCoordinates(_id: $_id, activityCoordinates: $activityCoordinates, activityApiCityNotFound: $activityApiCityNotFound)
    }
`

export const SET_WEATHER = gql`
    mutation SetWeather($_id: ID, $activityApiLastCall: Date, $activityWeatherIcon: String, $activityWeatherTemp: String, $activityWeatherDesc: String, $activityWeatherSunrise: String, $activityWeatherSunset: String, $activityWeatherWind: String) {
        setWeather(_id: $_id, activityApiLastCall: $activityApiLastCall, activityWeatherIcon: $activityWeatherIcon, activityWeatherTemp: $activityWeatherTemp, activityWeatherDesc: $activityWeatherDesc, activityWeatherSunrise: $activityWeatherSunrise, activityWeatherSunset: $activityWeatherSunset, activityWeatherWind: $activityWeatherWind)
    }
`

export const REMOVE_PARTICIPANT = gql`
    mutation RemoveParticipant($_id: ID!) {
        removeParticipant(_id: $_id)
    }
`

export const ADD_PARTICIPANT = gql`
    mutation AddParticipant($_id: ID!) {
        addParticipant(_id: $_id) 
    }
`

export const CHECK_USER_PARTICIPANT = gql`
    mutation CheckUserParticipant($_id: ID!) {
        checkUserParticipant(_id: $_id)
    }
`

export const CREATE_EVENT_ITEM = gql`
    mutation CreateEventItem($familyID: ID!, $activityImageUrl: String!, $activityName: String!, $activityDescription: String, $activityDate: Date!, $activityLocation: String!, $activityAddress: String, $activityUrl: String) {
        createEventItem(familyID: $familyID, activityImageUrl: $activityImageUrl, activityName: $activityName, activityDescription: $activityDescription, activityDate: $activityDate, activityLocation: $activityLocation, activityAddress: $activityAddress, activityUrl: $activityUrl)
    }
`

export const UPDATE_EVENT_ITEM = gql`
    mutation UpdateEventItem($_id: ID!, $activityImageUrl: String, $activityName: String, $activityDescription: String, $activityDate: Date, $activityLocation: String, $activityAddress: String, $activityUrl: String) {
        updateEventItem(_id: $_id, activityImageUrl: $activityImageUrl, activityName: $activityName, activityDescription: $activityDescription, activityDate: $activityDate, activityLocation: $activityLocation, activityAddress: $activityAddress, activityUrl: $activityUrl)
    }
`

export const CREATE_EVENT_COMMENT = gql`
    mutation createEventComment($_id: ID!, $commentText: String!) {
        createEventComment(_id: $_id, commentText: $commentText)
    }
`

export const REMOVE_EVENT_COMMENT = gql`
    mutation removeEventComment($commentId: ID!, $_id: ID!) {
        removeEventComment(commentId: $commentId, _id: $_id)
    }
`

export const REMOVE_NOTIFICATIONS = gql`
    mutation removeNotifications($eventId: ID!) {
        removeNotifications(eventId: $eventId)
    }
`