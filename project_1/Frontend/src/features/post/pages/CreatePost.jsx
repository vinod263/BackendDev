import React, { useState} from 'react'
import { usePost } from '../hooks/usePost'
import { useNavigate } from 'react-router'
import "../style/createPost.scss"
import { useRef } from 'react'
const CreatePost = () => {
  const [caption, setCaption] = useState("")
  const postImageInputFieldRef = useRef(null)

  const { loading, handleCreatePost } = usePost()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = postImageInputFieldRef.current.files[0]
    await handleCreatePost(caption, file)
    navigate("/")
  }
  if (loading) {
    return (
      <main><h1>creating post...</h1></main>
    )
  }
  return (

    <main className='create-post-page'>
      <div className="form-container">
        <h1>Create post</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="caption">Enter Caption</label>
          <input type="text"
            value={caption}
            name='caption'
            id='caption'
            placeholder='Enter Caption'
            onChange={(e) => setCaption(e.target.value)} />
          <label className="postImage" htmlFor="postImage">Select Image</label>
          <input
            type="file"
            ref={postImageInputFieldRef}
            accept='image/*'
            name='postImage'
            id='postImage' />
          <button type="submit" className='button primary-button'>Create post</button>
        </form>
      </div>
    </main>
  )
}

export default CreatePost