import { useState, useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { modeContext } from '../../context/modeContext'

import Loading from './Loading'

const baseURL = process.env.PUBLIC_URL
const MODE = process.env.REACT_APP_MODE

export const BasicProtectedRoute = ({
    children,
}) => {
    const redirectTo = `${baseURL}/`
    const redirectToLogout = `${baseURL}/security/logout?action=logout`
    const [status, setStatus] = useState(0)
    const { token } = useContext(modeContext)

    useEffect(() => {
        if (MODE === 'DEV') {
            setStatus(1)
        } else {
            fetch(`${process.env.REACT_APP_API}business/api/auth/isAuthorized`, {
                method: 'POST',
                headers: {
                    token: token,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.ok) {
                        setStatus(1)
                    } else {
                        if (res.status === 403)
                            setStatus(2)
                        else
                            setStatus(3)
                    }
                })
                .catch(error => console.error('Error:', error))
        }
    }, [token])

    console.log(status)

    if (status === 0)
        return <Loading></Loading>
    else if (status === 1)
        return children ? children : <Outlet />
    else if (status === 2)
        return <Navigate to={redirectTo} replace />
    else if (status === 3)
        return <Navigate to={redirectToLogout} replace />
}