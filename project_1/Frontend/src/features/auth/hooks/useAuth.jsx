import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext)
 
    const { user, setUser, loading, setLoading } =context

    const handleLogin = async (identifier,password)=> {
        setLoading(true)
        try{
            const response = await login(identifier,password)
            setUser(response.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

     const handleRegister = async (username, email,password)=>{
        setLoading(true)
        try{
            const response = await register(username, email, password)
            setUser(response.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }

    }
  


    return {
        user, loading, handleLogin, handleRegister
    }
}