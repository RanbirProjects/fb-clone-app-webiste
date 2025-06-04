import React, { useState } from 'react';
import { images } from '../assets/images';
import './Groups.css';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const groups = [
    {
      id: 1,
      name: 'Photography Enthusiasts',
      members: 12500,
      image: 'https://source.unsplash.com/random/400x300?photography',
      description: 'Share your photos, get feedback, and learn from other photographers.',
      category: 'Hobbies',
      isPrivate: false
    },
    {
      id: 2,
      name: 'Tech Startups',
      members: 8500,
      image: 'https://source.unsplash.com/random/400x300?startup',
      description: 'Connect with entrepreneurs, share ideas, and discuss the latest in tech.',
      category: 'Business',
      isPrivate: true
    },
    {
      id: 3,
      name: 'Fitness & Wellness',
      members: 25000,
      image: 'https://source.unsplash.com/random/400x300?fitness',
      description: 'Share workout tips, healthy recipes, and motivate each other.',
      category: 'Health',
      isPrivate: false
    },
    {
      id: 4,
      name: 'Book Club',
      members: 5000,
      image: 'https://source.unsplash.com/random/400x300?books',
      description: 'Monthly book discussions and literary conversations.',
      category: 'Entertainment',
      isPrivate: true
    },
    {
      id: 5,
      name: 'Travel Adventures',
      members: 15000,
      image: 'https://source.unsplash.com/random/400x300?travel',
      description: 'Share travel experiences, tips, and plan meetups.',
      category: 'Travel',
      isPrivate: false
    },
    {
      id: 6,
      name: 'Coding Community',
      members: 20000,
      image: 'https://source.unsplash.com/random/400x300?coding',
      description: 'Learn programming, share code, and help each other grow.',
      category: 'Technology',
      isPrivate: false
    }
  ];

  const categories = ['All', 'Hobbies', 'Business', 'Health', 'Entertainment', 'Travel', 'Technology'];

  return (
    <div className="groups-page">
      <div className="groups-header">
        <h1>Groups</h1>
        <div className="groups-actions">
          <button className="create-group">
            <i className="fas fa-plus"></i>
            Create New Group
          </button>
        </div>
      </div>

      <div className="groups-tabs">
        <button 
          className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
        <button 
          className={`tab ${activeTab === 'your-groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('your-groups')}
        >
          Your Groups
        </button>
      </div>

      <div className="categories">
        {categories.map(category => (
          <button key={category} className="category-btn">
            {category}
          </button>
        ))}
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-image">
              <img src={group.image} alt={group.name} />
              {group.isPrivate && (
                <span className="private-badge">
                  <i className="fas fa-lock"></i>
                  Private
                </span>
              )}
            </div>
            <div className="group-info">
              <h3>{group.name}</h3>
              <p className="members">
                <i className="fas fa-users"></i>
                {group.members.toLocaleString()} members
              </p>
              <p className="description">{group.description}</p>
              <div className="group-footer">
                <span className="category">{group.category}</span>
                <button className="join-btn">Join Group</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups; 