import React from 'react'
import { act, render, screen } from "@testing-library/react"
import { MockedProvider } from '@apollo/client/testing'
import { CookiesProvider, Cookies } from 'react-cookie'

import '@testing-library/jest-dom'

import App from './App'

const cookies = new Cookies()

test('App rendering/check cookie', () => {
    render(
        <MockedProvider>
            <CookiesProvider cookies={cookies}>
                <App />
            </CookiesProvider>
        </MockedProvider>
    )


    // verify login page is displayed if no cookie
    act(() => {
        cookies.set(null)
    })

    expect(screen.getByText(/Login/i)).toBeInTheDocument()

    // verify to land on family board if cookie exists
    act(() => {
        cookies.set('userToken', '1234', {
            maxAge: (60*60*24),
            sameSite: true
        })
    })

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
})