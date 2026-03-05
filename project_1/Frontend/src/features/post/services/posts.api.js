import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000/api/posts",
    withCredentials:true,
});

export async function getFeed() {
    try {
        const response = await api.get("/feed")
        return response.data
    } catch (error) {
        throw error
    }
    
}

export async function createPost(caption, imageFile) {
  try {
    const formData = new FormData()
    formData.append("caption", caption)
    formData.append("image", imageFile)

    const response = await api.post("/", formData)
    return response.data
  } catch (error) {
    throw error
  }
}
    
export async function likePost(postId) {
  const response = await api.post("/like/"+postId)
  return response.data
  
}
export async function unlikePost(postId) {
  const response = await api.post("/unlike/"+postId)
  return response.data
  
}

