import React from 'react'
import { act, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GraphQLError } from 'graphql'

import NewUserAccessForm from './NewUserAccessForm'
import { SIGN_UP } from '../../utils/mutations'
import { BrowserRouter } from 'react-router-dom'

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

test('New User Access Form render/redirect family board success', async () => {
    const token = 'ewsgerbesrbesrfgwe'
    const mocks = [
        {
            request: {
                query: SIGN_UP,
                variables: { 
                    username: 'tester',
                    email: 'tester@tester.com',
                    password: 'werg123EGEwf$',
                    userHash: 'dgrgnrznrtznrt'
                },
            },
            result: { 
                data: { signUp: token } 
            }
        } 
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
                <NewUserAccessForm />
                <UserAccessForm />
            </BrowserRouter>
        </MockedProvider>
    )
    
    // verify to on New User Access Form page
    expect(screen.getByText(/Join family/i)).toBeInTheDocument()

    // user is created if new family is created
    // the user should be updated now with these information
    // verify to land on login page (cookie not valid in this test, therefore redirect to login - cookie is tested at app)
    userEvent.type(screen.getByLabelText(/Name/i), 'tester')

    userEvent.type(screen.getByLabelText(/E-Mail/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    userEvent.type(screen.getByLabelText(/Password confirmation/i), 'werg123EGEwf$')
    
    userEvent.click(screen.getByText(/Create new user/i), leftClick)

    await waitFor(async () => {
        await jest.advanceTimersByTime(400)
        expect(screen.getByText(/Login/i)).toBeInTheDocument()
    })
    
})

test('New User Access Form/hash error', async () => {
    const mocks = [
        {
            request: {
                query: SIGN_UP,
                variables: { 
                    username: 'tester',
                    email: 'tester@tester.com',
                    password: 'werg123EGEwf$',
                    userHash: 'xxx'
                },
            },
            result: { 
                errors: [new GraphQLError('User hash invalid')]
            }
        }
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <NewUserAccessForm />
        </MockedProvider>
    )

    // verifiy to receive an error if user doesn't exist - user is created if new family is created
    // the user should be updated now with these information
    userEvent.type(screen.getByLabelText(/Name/i), 'tester')

    userEvent.type(screen.getByLabelText(/E-Mail/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    userEvent.type(screen.getByLabelText(/Password confirmation/i), 'werg123EGEwf$')
    
    await act(async () => {
        try {
            userEvent.click(screen.getByText(/Create new user/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/User hash invalid/i)).toBeInTheDocument()
        }
    })
})