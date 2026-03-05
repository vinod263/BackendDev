import React,{useEffect, useState} from "react";
import "../style/feed.scss";
import { usePost } from "../hooks/usePost";
import Nav from "../../shared/Components/NAv";
import { formatTimeAgo } from "../../../utils/timeFormatter";
// const stories = [
//   { id: 1, username: "your_story", avatar: "https://i.pravatar.cc/60?img=10" },
//   { id: 2, username: "john", avatar: "https://i.pravatar.cc/60?img=11" },
//   { id: 3, username: "alex", avatar: "https://i.pravatar.cc/60?img=12" },
//   { id: 4, username: "sarah", avatar: "https://i.pravatar.cc/60?img=13" },
//   { id: 5, username: "mike", avatar: "https://i.pravatar.cc/60?img=14" },
//   { id: 6, username: "emma", avatar: "https://i.pravatar.cc/60?img=15" },
// ];
const Feed = () => {

  const {feed, handleGetFeed,loading,handleLike,handleUnLike} = usePost()
  const [, setRefresh] = useState(0);

  useEffect(()=>{
    handleGetFeed()
  },[])

  // Auto-refresh timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(prev => prev + 1);
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  if(loading||!feed){
    return (
      <main><h1>Feed is loading...</h1></main>
    )
  }

  console.log(feed)

  return (
    <div className="feed">
      <Nav/>
      {/* 🔥 STORIES SECTION
      <div className="stories">
        {stories.map((story) => (
          <div className="story" key={story.id}>
            <div className="story-avatar">
              <img src={story.avatar} alt="" />
            </div>
               <div className="add-btn">+</div>
    
            <span>{story.username}</span>
          </div>
        ))}
      </div> */}


      {feed.map((post) => (
             <div className="post" key={post._id}>
          
          {/* Header */}
           <div className="post-header">
            <div className="user-info">
              <div className="img-wrapper">
              <img src={post.user.profileImage} alt="" />
              </div>
              <div className="user-details">
                <span className="username">{post.user.username}</span>
                <span className="timestamp">{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <span className="dots">•••</span>
          </div>

          {/* Post Image */}
          <div className="post-image">
            <img src={post.imgUrl} alt="" />
          </div>

          {/* Actions */}
          <div className="post-actions">
            <div className="left-actions">
              <button 
              className={post.isLiked?"Like":"" }
              onClick={()=>{post.isLiked?handleUnLike(post._id):handleLike(post._id)}}
              >{post.isLiked?"❤️":"🩶" }
              </button>
              <button>💬</button>
              <button>📤</button>
            </div>
            <button>🔖</button>
          </div>

          {/* Likes */}
          <div className="post-likes">
            <span>{post.likesCount} likes</span>
          </div>

          {/* Caption */}
          <div className="post-caption">
            <span className="username">{post.username}</span>
            <span>{post.caption}</span>
          </div>

        </div>
 
      ))}
    </div>
  );
};

export default Feed;