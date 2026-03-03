import { createContext, useState, useEffect } from "react";


export const PostsContext = createContext()

export function PostContextProvider({ children }) {

    const [loading, setLoading] = useState(false)
    const [post, setPost ] =useState(null)
    const [feed, setFeed] = useState(null)

    
    return(
        <PostsContext.Provider value={{post,setPost,loading,setLoading,feed,setFeed}}>
            {children}
        </PostsContext.Provider>
    )
    
}
