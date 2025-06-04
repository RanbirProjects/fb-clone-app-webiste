import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { images } from '../assets/images';
import './Home.css';

const Home = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stories = [
    { id: 1, user: 'John Doe', image: images.stories.story1, profilePic: images.profiles.user1 },
    { id: 2, user: 'Jane Smith', image: images.stories.story2, profilePic: images.profiles.user2 },
    { id: 3, user: 'Mike Johnson', image: images.stories.story3, profilePic: images.profiles.user3 },
    { id: 4, user: 'Sarah Wilson', image: images.stories.story4, profilePic: images.profiles.user4 },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedImage) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('user', 'You');
      formData.append('userImage', images.profiles.user1);
      
      if (selectedImage) {
        // Convert base64 to blob
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      }

      const response = await axios.post('http://localhost:5001/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setPostContent('');
      setSelectedImage(null);
      setShowImageUpload(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="home">
      <div className="stories-container">
        <div className="create-story">
          <img src={images.stories.story1} alt="Your story" />
          <div className="create-story-overlay">
            <i className="fas fa-plus"></i>
            <span>Create Story</span>
          </div>
        </div>
        {stories.map(story => (
          <div key={story.id} className="story">
            <img src={story.image} alt={story.user} />
            <div className="story-overlay">
              <img src={story.profilePic} alt={story.user} className="story-avatar" />
              <span>{story.user}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="create-post">
        <div className="create-post-top">
          <img src={images.profiles.user1} alt="Your profile" />
          <input
            type="text"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        {selectedImage && (
          <div className="selected-image-preview">
            <img src={selectedImage} alt="Selected" />
            <button onClick={() => setSelectedImage(null)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        <div className="create-post-bottom">
          <button className="post-option" onClick={() => setShowImageUpload(true)}>
            <i className="fas fa-images"></i>
            <span>Photo/Video</span>
          </button>
          <button className="post-option">
            <i className="fas fa-video"></i>
            <span>Live Video</span>
          </button>
          <button className="post-option" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <i className="fas fa-smile"></i>
            <span>Feeling/Activity</span>
          </button>
          <button 
            className="post-button" 
            onClick={handlePost}
            disabled={isLoading || (!postContent.trim() && !selectedImage)}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
        {showImageUpload && (
          <div className="image-upload-overlay">
            <div className="image-upload-content">
              <h3>Add Photo/Video</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                <i className="fas fa-upload"></i>
                <span>Upload Photo</span>
              </label>
              <button onClick={() => setShowImageUpload(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {posts.map(post => (
        <div key={post.id} className="post">
          <div className="post-header">
            <img src={post.userImage} alt={post.user} />
            <div className="post-info">
              <h3>{post.user}</h3>
              <span>{post.time}</span>
            </div>
            <button className="post-menu">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <div className="post-content">
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post content" />}
          </div>
          <div className="post-stats">
            <div className="post-stat">
              <i className="fas fa-thumbs-up"></i>
              <span>{post.likes}</span>
            </div>
            <div className="post-stat">
              <span>{post.comments.length} comments</span>
            </div>
          </div>
          <div className="post-actions">
            <button className="post-action" onClick={() => handleLike(post.id)}>
              <i className="fas fa-thumbs-up"></i>
              <span>Like</span>
            </button>
            <button className="post-action">
              <i className="fas fa-comment"></i>
              <span>Comment</span>
            </button>
            <button className="post-action">
              <i className="fas fa-share"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home; 