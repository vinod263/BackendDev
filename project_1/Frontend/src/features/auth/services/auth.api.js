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

export async function login(email, password) {
        try {
      await axios.post("/login", {
        identifier: formData.identifier,
        password: formData.password
      })
      alert("login successful!");
      // optionally redirect or clear form here
    } catch (error) {
      if (error.response?.status === 409) {
        alert("User not found.");
      } else if (error.response?.status === 401) {
        alert("Password invalid")
      }
      else {
        alert("Something went wrong. Try again.");
      }
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