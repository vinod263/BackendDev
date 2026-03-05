import { createPost, getFeed, likePost, unlikePost } from '../services/posts.api'
import { useContext, useEffect } from 'react'
import { PostsContext } from '../posts.context'

export const usePost = () => {
  const context = useContext(PostsContext);

  const { post, setPost, loading, setLoading, feed, setFeed } = context

  const handleGetFeed = async () => {
    setLoading(true)
    const data = await getFeed()
    setFeed(data.posts.reverse())
    setLoading(false)
  }

  const handleCreatePost = async (caption, imageFile) => {
    try {
      setLoading(true)
      const data = await createPost(caption, imageFile)
      setFeed([data.post, ...feed])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    // Optimistic update - update state immediately
    setFeed(prevFeed => 
      prevFeed.map(post => 
        post._id === postId 
          ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
          : post
      )
    )
    
    try {
      await likePost(postId)
    } catch (error) {
      console.log(error)
      // Revert on error
      setFeed(prevFeed => 
        prevFeed.map(post => 
          post._id === postId 
            ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
            : post
        )
      )
    }
  }

  const handleUnLike = async (postId) => {
    // Optimistic update - update state immediately
    setFeed(prevFeed => 
      prevFeed.map(post => 
        post._id === postId 
          ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
          : post
      )
    )
    
    try {
      await unlikePost(postId)
    } catch (error) {
      console.log(error)
      // Revert on error
      setFeed(prevFeed => 
        prevFeed.map(post => 
          post._id === postId 
            ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
            : post
        )
      )
    }
  }
  useEffect(() => {
    handleGetFeed()
  }, [])
  return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }

}