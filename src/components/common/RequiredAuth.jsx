import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Navigate } from 'react-router-dom'

const RequiredAuth = ({ children }) => {
    const { user } = useContext(AuthContext)
    if (!user) {
        return <Navigate to="/account/login" />
    }
    return children;
}
export default RequiredAuth

