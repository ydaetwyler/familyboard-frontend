import React from 'react'
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import '@testing-library/jest-dom'

import Login from './Login'

const leftClick = { button: 0 }

test('Login rendering/navigating links', () => {
    render(
        <MockedProvider>
            <Login />
        </MockedProvider>
    )

    // verify to be on login page
    expect(screen.getByText(/Login/i)).toBeInTheDocument()

    // Check lost password click
    userEvent.click(screen.getByText(/Lost Password/i), leftClick)
    
    expect(screen.getByText(/Reset password/i)).toBeInTheDocument()

    // Check create new family click
    userEvent.click(screen.getByText(/Create new family/i), leftClick)
    
    expect(screen.getByText(/Start family/i)).toBeInTheDocument()
})