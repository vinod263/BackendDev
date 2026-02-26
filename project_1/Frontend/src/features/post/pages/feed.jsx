import React from "react";
import "../style/feed.scss";

const posts = [
  {
    id: 1,
    username: "john_doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    image: "https://picsum.photos/500/500?random=1",
    likes: 124,
    caption: "Enjoying the beautiful sunset 🌅",
  },
  {
    id: 2,
    username: "alex_99",
    avatar: "https://i.pravatar.cc/40?img=2",
    image: "https://picsum.photos/500/500?random=2",
    likes: 342,
    caption: "Travel diaries ✈️",
  },
  {
    id: 3,
    username: "alex_99",
    avatar: "https://i.pravatar.cc/40?img=3",
    image: "https://picsum.photos/500/500?random=3",
    likes: 342,
    caption: "Travel diaries ✈️",
  },
  {
    id: 4,
    username: "alex_99",
    avatar: "https://i.pravatar.cc/40?img=4",
    image: "https://picsum.photos/500/500?random=4",
    likes: 342,
    caption: "Travel diaries ✈️",
  },
];

const Feed = () => {
  return (
    <div className="feed">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          
          {/* Header */}
          <div className="post-header">
            <div className="user-info">
              <img src={post.avatar} alt="" />
              <span>{post.username}</span>
            </div>
            <span className="dots">•••</span>
          </div>

          {/* Post Image */}
          <div className="post-image">
            <img src={post.image} alt="" />
          </div>

          {/* Actions */}
          <div className="post-actions">
            <div className="left-actions">
              <span>❤️</span>
              <span>💬</span>
              <span>📤</span>
            </div>
            <span>🔖</span>
          </div>

          {/* Likes */}
          <div className="post-likes">
            <span>{post.likes} likes</span>
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