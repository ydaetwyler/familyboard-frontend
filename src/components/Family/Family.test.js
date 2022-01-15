import React from 'react'
import { render, screen,waitFor } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import { gql } from '@apollo/client'

import '@testing-library/jest-dom'

import Family from './Family'
import { GraphQLError } from 'graphql'

export const GET_FAMILY = gql`
    query GetFamily {
        getFamily {
            familyName
        }
    }
`

const mocksError= [
    {
        request: {
            query: GET_FAMILY,
        },
        result: {
            errors: [new GraphQLError('Login necessary')]
        }
    }
]

const mocksSuccess = [
    {
        request: {
            query: GET_FAMILY,
        },
        result: {
            data: {
                getFamily: {
                    familyName: "FeuersteinForever"
                }
            }
        }
    }
]

test('Family render/authentication error', async () => {
    render(
        <MockedProvider mocks={mocksError} addTypename={false}>
            <Family />
        </MockedProvider>
    )
    
    await waitFor(() =>new Promise(resolve => setTimeout(resolve, 0)))

    // verify to be on login page
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
})

test('Family render/success', async () => {
    render(
        <MockedProvider mocks={mocksSuccess} addTypename={false}>
            <Family />
        </MockedProvider>
    )
    
    await waitFor(() =>new Promise(resolve => setTimeout(resolve, 0)))

    // verify to be on Family Board page
    expect(screen.getByText(/Family Board/i)).toBeInTheDocument()

    // verify the family is loaded
    expect(screen.getByText(/FeuersteinForever/i)).toBeInTheDocument()
})