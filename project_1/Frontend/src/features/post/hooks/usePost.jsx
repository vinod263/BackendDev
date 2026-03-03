import {getFeed} from '../services/posts.api'
import { useContext } from 'react'
import {PostsContext} from '../posts.context'

export const usePost = ()=>{
    const context =useContext(PostsContext);

    const {post,setPost,loading,setLoading,feed,setFeed} =context

    const handleGetFeed =async ()=>{
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    return {loading,feed,post,handleGetFeed}

}