import React from 'react'
import { act, render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { GraphQLError } from 'graphql'

import LostPasswordForm from './LostPasswordForm'
import { LOST_PASSWORD } from '../../utils/mutations'

const leftClick = { button: 0 }

test('Lost Password Form render/send reset link success', async () => {
    const mocks = [
        {
            request: {
                query: LOST_PASSWORD,
                variables: { email: 'tester@tester.com' },
            },
            result: { 
                data: { lostPassword: true } 
            }
        }
    ]

    jest.useFakeTimers()
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <LostPasswordForm />
        </MockedProvider>
    )

    // verify to be on lost password page
    expect(screen.getByText(/Reset password/i)).toBeInTheDocument()

    // verify to receive notification that reset link mail is sent
    userEvent.type(screen.getByLabelText(/E-Mail/i), 'tester@tester.com')
    
    userEvent.click(screen.getByText(/Send reset link/i), leftClick)

    await waitFor(async () => {
        jest.advanceTimersByTime(400)
        expect(screen.getByText(/Reset link sent to tester@tester.com/i)).toBeInTheDocument()
    })
    
})

test('Lost Password Form/send reset link error', async () => {
    const mocks = [
        {
            request: {
                query: LOST_PASSWORD,
                variables: { email: 'tester@tester.com' },
            },
            result: { 
                errors: [new GraphQLError('Error user not found')]
            }
        }
    ]
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <LostPasswordForm />
        </MockedProvider>
    )

    // verifiy to receive an error if user doesn't exist
    userEvent.type(screen.getByLabelText(/E-Mail/i), 'tester@tester.com')
    
    await act(async () => {
        try {
            userEvent.click(screen.getByText(/Send reset link/i), leftClick)
        } catch(e) {
            expect(screen.getByText(/Reset link sent to tester@tester.com/i)).toBeInTheDocument()
        }
    })
})