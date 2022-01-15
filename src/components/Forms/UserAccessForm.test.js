import React from 'react'
import { act, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GraphQLError } from 'graphql'
import { CookiesProvider, Cookies } from 'react-cookie'

import { SIGN_IN } from '../../utils/mutations'
import UserAccessForm from './UserAccessForm'

const leftClick = { button: 0 }

jest.useFakeTimers()

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}))

const cookies = new Cookies()

// Cookie is already tested at App - Here we only test failed logins

test('User Access Form render/login error', async () => {
    const token = 'ewsgerbesrbesrfgwe'
    const mocks = [
        {
            request: {
                query: SIGN_IN,
                variables: { 
                    email: 'tester@tester.com',
                    password: 'werg123EGEwf$',
                },
            },
            result: {
                errors: [new GraphQLError('Error signing in')]
            }
        }
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <CookiesProvider>
                <UserAccessForm />
            </CookiesProvider>
        </MockedProvider>
    )
    
    // verify login page is displayed
    expect(screen.getByText(/Login$/i)).toBeInTheDocument()

     // verify to receive error message
    userEvent.type(screen.getByLabelText(/E-Mail$/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    await act(async () => {
        try {
            userEvent.click(screen.getByText(/^Enter$/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Error signing in/i)).toBeInTheDocument()
        }
    })
    
})

test('User Access Form/login error delay after 3 attempts', async () => {
    const token = 'ewsgerbesrbesrfgwe'
    const mocks = [
        {
            request: {
                query: SIGN_IN,
                variables: { 
                    email: 'tester@tester.com',
                    password: 'werg123EGEwf$',
                },
            },
            result: {
                errors: [new GraphQLError('Error signing in')]
            }
        }
    ]

    const setState = jest.fn()
    const useStateMock = (initState) => [initState, setState]

    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <CookiesProvider>
                <UserAccessForm />
            </CookiesProvider>
        </MockedProvider>
    )
    
    // verify login page is displayed
    expect(screen.getByText(/Login$/i)).toBeInTheDocument()

    // 1
    userEvent.type(screen.getByLabelText(/E-Mail$/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    await act(async () => {
        try {
            userEvent.click(screen.getByText(/^Enter$/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Error signing in/i)).toBeInTheDocument()
        }
    })

    // 2
    userEvent.type(screen.getByLabelText(/E-Mail$/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    await act(async () => {
        try {
            userEvent.click(screen.getByText(/^Enter$/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Error signing in/i)).toBeInTheDocument()
        }
    })

    // 3
    userEvent.type(screen.getByLabelText(/E-Mail$/i), 'tester@tester.com')

    userEvent.type(screen.getByLabelText(/Password$/i), 'werg123EGEwf$')

    await act(async () => {
        try {
            userEvent.click(screen.getByText(/^Enter$/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Too many failed attempts/i)).toBeInTheDocument()
        }
    })
    
})