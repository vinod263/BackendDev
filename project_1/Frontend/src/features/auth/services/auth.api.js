import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register(username, email, password) {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
}

export async function login(identifier, password) {
      
     const response= await  api.post("/login", {
        identifier: identifier,
        password: password
      })

      return response.data
      // optionally redirect or clear form here
    }


export async function getMe() {
    
        const response = await api.get("/get-me")
        return response.data
    
    
    
}

//API layer