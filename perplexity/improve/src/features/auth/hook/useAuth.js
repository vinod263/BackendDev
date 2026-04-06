/* eslint-disable no-unused-vars */
import {useDispatch} from "react-redux";
import { register, login, getMe } from "../service/auth.api.js";
import  {setUser, setLoading, setError} from '../auth.slice.js';

export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister({email, username, password}) {
        try {
            dispatch(setLoading(true))
            const data =await register({email, username, password })
            console.log(data)
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Register failed"))            
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}) {
        try {
            dispatch(setLoading(true))
            const data =await login({email, password })
            dispatch(setUser(data.user))
               console.log(data)
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))       
            console.log(error.response?.data?.message)     
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "failed to fetch user"))    
            console.log(error.response?.data?.message)        
        } finally {
            dispatch(setLoading(false))
        }
        
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }
    
}