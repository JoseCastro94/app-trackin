import React, { useState } from 'react'

import items from '../menu-items'
import generate from '../menu-items/generate'

const modeContext = React.createContext()

const ModeProvider = ({ children }) => {
    const [company, setCompany] = useState(getInitialCompany())

    function getInitialCompany() {
        const isReturningCompany = "company" in localStorage
        if (isReturningCompany) {
            const savedCompany = JSON.parse(localStorage.getItem("company"))
            return savedCompany
        } else {
            return null
        }
    }

    const [navigation, setNavigation] = useState(getInitialNavigate())

    function getInitialNavigate() {
        const isReturningNavigate = "navigate" in localStorage
        try {
            if (isReturningNavigate) {
                const savedNavigate = JSON.parse(localStorage.getItem("navigate"))
                return generate(savedNavigate)
            } else {
                return items
            }
        } catch (ex) {
            console.log(ex)
            //localStorage.removeItem("nav")
        }
        return items
    }

    const [token, setToken] = useState(getInitialToken())
    function getInitialToken() {
        const isReturningToken = "token" in localStorage
        if (isReturningToken) {
            const savedToken = localStorage.getItem("token")
            return savedToken
        } else {
            return null
        }
    }

    const [tokenCompany, setTokenCompany] = useState(getInitialTokenCompany())
    function getInitialTokenCompany() {
        const isReturningTokenCompany = "tokenCompany" in localStorage
        if (isReturningTokenCompany) {
            const savedTokenCompany = localStorage.getItem("tokenCompany")
            return savedTokenCompany
        } else {
            return null
        }
    }

    const [user, setUser] = useState(getInitialUser())
    function getInitialUser() {
        const isReturningUser = "user" in localStorage
        try {
            if (isReturningUser) {
                const savedUser = JSON.parse(localStorage.getItem("user"))
                return savedUser
            } else {
                return { name: 'no determinado' }
            }
        } catch {
            localStorage.removeItem("user")
        }
        return { name: 'no determinado' }
    }

    // useEffect(() => {
    //     if (token) {
    //         const { fetch: originalFetch } = window;

    //         window.fetch = async (...args) => {
    //             let [resource, config = {}] = args
    //             const headers = config ? { ...config.headers } : {}
    //             headers.token = localStorage.getItem('token')
    //             headers.empresa = localStorage.getItem('tokenCompany')
    //             config.headers = headers
    //             return originalFetch(resource, config)
    //         }
    //     }
    // }, [token, tokenCompany])

    return (
        <modeContext.Provider value={{
            setNavigation: setNavigation,
            navigation: navigation,
            setToken: setToken,
            token: token,
            setUser: setUser,
            user: user,
            company: company,
            setCompany: setCompany,
            tokenCompany: tokenCompany,
            setTokenCompany: setTokenCompany,
        }}>
            {children}
        </modeContext.Provider>
    )
}

export { ModeProvider, modeContext }
