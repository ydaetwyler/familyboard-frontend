import React from 'react'
import { act, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GraphQLError } from 'graphql'
import { BrowserRouter } from 'react-router-dom'

import ResetPasswordForm from './ResetPasswordForm'
import { RESET_PASSWORD} from '../../utils/mutations'
import UserAccessForm from './UserAccessForm'

const leftClick = { button: 0 }

jest.useFakeTimers()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        hash: 'dgrgnrznrtznrt'
    })
}))

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}))

test('Reset Password Form render/reset success', async () => {
    const token = 'ewsgerbesrbesrfgwe'
    const mocks = [
        {
            request: {
                query: RESET_PASSWORD,
                variables: { 
                    password: 'werg123EGEwf$',
                    userHash: 'dgrgnrznrtznrt'
                },
            },
            result: { 
                data: { token } 
            }
        }
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
                <ResetPasswordForm />
                <UserAccessForm />
            </BrowserRouter>
        </MockedProvider>
    )

    // verify to be on Reset Password Form page
    expect(screen.getByText(/^Set new password$/i)).toBeInTheDocument()

     // verify to land on login page (cookie not valid in this test, therefore redirect to login - cookie is tested at app)
    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    userEvent.type(screen.getByLabelText(/Password confirmation$/i), 'werg123EGEwf$')
    
    userEvent.click(screen.getByText(/^Set password$/i), leftClick)

    await waitFor(async () => {
        jest.advanceTimersByTime(400)
        expect(screen.getByText(/Login/i)).toBeInTheDocument()
    })
    
})

test('Reset Password Form/reset error', async () => {
    const mocks = [
        {
            request: {
                query: RESET_PASSWORD,
                variables: { 
                    password: 'werg123EGEwf$',
                    userHash: 'dgrgnrznrtznrt'
                },
            },
            result: { 
                errors: [new GraphQLError('Error user not found')]
            }
        }
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <ResetPasswordForm />
        </MockedProvider>
    )

    // verifiy to receive an error if user doesn't exist
    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    userEvent.type(screen.getByLabelText(/Password confirmation$/i), 'werg123EGEwf$')
    
    await act(async () => {
        try {
            userEvent.click(screen.getByText(/^Set password$/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Error user not found/i)).toBeInTheDocument()
        }
    })
})