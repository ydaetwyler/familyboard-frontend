import React from 'react'
import { render, screen, waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import NewFamilyForm from './NewFamilyForm'
import { CREATE_FAMILY } from '../../utils/mutations'
import { BrowserRouter } from 'react-router-dom'

import NewUserAccess from '../Forms/NewUserAccessForm'

const leftClick = { button: 0 }

test('New Family Form render/redirect to create new user success', async () => {
    const hash = 'ewsgerbesrbesrfgwe'
    const mocks = [
        {
            request: {
                query: CREATE_FAMILY,
                variables: { familyName: 'y' },
            },
            result: { 
                data: { createFamily: hash } 
            }
        }
    ]

    jest.useFakeTimers()
    
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
                <NewUserAccess />
                <NewFamilyForm />
            </BrowserRouter>
        </MockedProvider>
    )

    // verify to be on new family form page
    expect(screen.getByText(/Start family/i)).toBeInTheDocument()

    // verifiy to land on create new user page
    userEvent.type(screen.getByLabelText(/Family name/i), 'y')
    
    userEvent.click(screen.getByText(/Create family/i), leftClick)

    await waitFor(async () => {
        jest.advanceTimersByTime(400)
        expect(screen.getByText(/Join family/i)).toBeInTheDocument()
    })
    
})
