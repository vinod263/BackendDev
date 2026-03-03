import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login(identifier, password) {
        try {
     const response= await  api.post("/login", {
        identifier: identifier,
        password: password
      })

      return response.data
      // optionally redirect or clear form here
    } catch (error) {
      throw error
    }
}

export async function getMe() {
    try {
        const response = await api.get("/get-me")
        return response.data
    }
    catch(err){
        throw err
    }
    
}

//API layer