import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'John Doe',
      content: 'liked your post',
      time: '5m ago',
      image: 'https://source.unsplash.com/random/40x40?portrait=1'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Jane Smith',
      content: 'commented on your photo',
      time: '1h ago',
      image: 'https://source.unsplash.com/random/40x40?portrait=2'
    },
    {
      id: 3,
      type: 'friend',
      user: 'Mike Johnson',
      content: 'sent you a friend request',
      time: '2h ago',
      image: 'https://source.unsplash.com/random/40x40?portrait=3'
    }
  ];

  const messages = [
    {
      id: 1,
      user: 'Sarah Wilson',
      lastMessage: 'Hey, how are you?',
      time: '5m ago',
      unread: true,
      image: 'https://source.unsplash.com/random/40x40?portrait=4'
    },
    {
      id: 2,
      user: 'David Brown',
      lastMessage: 'See you tomorrow!',
      time: '1h ago',
      unread: false,
      image: 'https://source.unsplash.com/random/40x40?portrait=5'
    },
    {
      id: 3,
      user: 'Emily Davis',
      lastMessage: 'Thanks for the help!',
      time: '2h ago',
      unread: true,
      image: 'https://source.unsplash.com/random/40x40?portrait=6'
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <i className="fab fa-facebook"></i>
          </Link>
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search Facebook" />
          </div>
        </div>

        <div className="navbar-center">
          <Link to="/" className={`nav-icon ${location.pathname === '/' ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
          </Link>
          <Link to="/watch" className={`nav-icon ${location.pathname === '/watch' ? 'active' : ''}`}>
            <i className="fas fa-tv"></i>
          </Link>
          <Link to="/marketplace" className={`nav-icon ${location.pathname === '/marketplace' ? 'active' : ''}`}>
            <i className="fas fa-store"></i>
          </Link>
          <Link to="/groups" className={`nav-icon ${location.pathname === '/groups' ? 'active' : ''}`}>
            <i className="fas fa-users"></i>
          </Link>
          <Link to="/gaming" className="nav-icon">
            <i className="fas fa-gamepad"></i>
          </Link>
        </div>

        <div className="navbar-right">
          <div className="nav-icons">
            <button className="nav-icon">
              <i className="fas fa-plus"></i>
            </button>
            <button className="nav-icon">
              <i className="fab fa-facebook-messenger"></i>
            </button>
            <button 
              className="nav-icon"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
            >
              <i className="fas fa-bell"></i>
              {showNotifications && (
                <div className="dropdown-menu notifications">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <button>Mark all as read</button>
                  </div>
                  {notifications.map(notification => (
                    <div key={notification.id} className="dropdown-item">
                      <img src={notification.image} alt={notification.user} />
                      <div className="item-content">
                        <p>
                          <strong>{notification.user}</strong> {notification.content}
                        </p>
                        <span className="time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="see-all">See All Notifications</button>
                </div>
              )}
            </button>
            <button 
              className="nav-icon"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
            >
              <i className="fas fa-comment-dots"></i>
              {showMessages && (
                <div className="dropdown-menu messages">
                  <div className="dropdown-header">
                    <h3>Messages</h3>
                    <button>New Message</button>
                  </div>
                  {messages.map(message => (
                    <div key={message.id} className="dropdown-item">
                      <img src={message.image} alt={message.user} />
                      <div className="item-content">
                        <p>
                          <strong>{message.user}</strong>
                          <span className="message">{message.lastMessage}</span>
                        </p>
                        <span className="time">{message.time}</span>
                      </div>
                      {message.unread && <span className="unread-badge"></span>}
                    </div>
                  ))}
                  <button className="see-all">See All Messages</button>
                </div>
              )}
            </button>
          </div>

          <div className="profile-menu">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img src="https://source.unsplash.com/random/40x40?portrait=7" alt="Profile" />
              <span>Your Name</span>
            </button>
            {showProfileMenu && (
              <div className="dropdown-menu profile">
                <Link to="/profile">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </Link>
                <Link to="/settings">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
                <button className="logout">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 