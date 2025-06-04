import React from 'react';
import { images } from '../assets/images';
import './Watch.css';

const Watch = () => {
  const videos = [
    {
      id: 1,
      title: 'Amazing Nature Documentary',
      thumbnail: 'https://source.unsplash.com/random/400x225?nature',
      views: '1.2M views',
      time: '2 days ago',
      channel: 'Nature Channel',
      channelImage: images.profiles.user1
    },
    {
      id: 2,
      title: 'Cooking with Friends',
      thumbnail: 'https://source.unsplash.com/random/400x225?cooking',
      views: '500K views',
      time: '1 week ago',
      channel: 'Food Network',
      channelImage: images.profiles.user2
    },
    {
      id: 3,
      title: 'Tech Review: Latest Gadgets',
      thumbnail: 'https://source.unsplash.com/random/400x225?technology',
      views: '800K views',
      time: '3 days ago',
      channel: 'Tech Reviews',
      channelImage: images.profiles.user3
    },
    {
      id: 4,
      title: 'Travel Vlog: Paris',
      thumbnail: 'https://source.unsplash.com/random/400x225?paris',
      views: '2M views',
      time: '1 month ago',
      channel: 'Travel Channel',
      channelImage: images.profiles.user4
    }
  ];

  return (
    <div className="watch-page">
      <div className="watch-header">
        <h1>Watch</h1>
        <div className="watch-filters">
          <button className="active">For You</button>
          <button>Live</button>
          <button>Gaming</button>
          <button>Following</button>
        </div>
      </div>

      <div className="watch-content">
        <div className="featured-video">
          <div className="video-player">
            <img src={videos[0].thumbnail} alt={videos[0].title} />
            <button className="play-button">
              <i className="fas fa-play"></i>
            </button>
          </div>
          <div className="video-info">
            <h2>{videos[0].title}</h2>
            <div className="video-stats">
              <span>{videos[0].views}</span>
              <span>{videos[0].time}</span>
            </div>
            <div className="video-actions">
              <button>
                <i className="fas fa-thumbs-up"></i>
                <span>Like</span>
              </button>
              <button>
                <i className="fas fa-comment"></i>
                <span>Comment</span>
              </button>
              <button>
                <i className="fas fa-share"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="video-grid">
          {videos.slice(1).map(video => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <span className="video-duration">10:30</span>
              </div>
              <div className="video-details">
                <img src={video.channelImage} alt={video.channel} className="channel-image" />
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="channel-name">{video.channel}</p>
                  <div className="video-stats">
                    <span>{video.views}</span>
                    <span>{video.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch; 