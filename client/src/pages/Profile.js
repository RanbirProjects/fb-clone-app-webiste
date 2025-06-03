import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { setPosts } from '../state/postsSlice';
import { setFriends } from '../state/authSlice';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts);
  const [profileUser, setProfileUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfileUser(response.data);
      setIsFriend(response.data.friends.includes(user._id));
      setIsRequestSent(response.data.friendRequests.includes(user._id));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${userId}/posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(setPosts(response.data));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserPosts();
  }, [userId]);

  const handleFriendRequest = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/friend-request`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setIsRequestSent(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/accept-friend`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setIsFriend(true);
      setIsRequestSent(false);
      const response = await axios.get(`http://localhost:5000/api/users/${user._id}/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(setFriends({ friends: response.data }));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  if (!profileUser) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profileUser.profilePicture}
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {profileUser.firstName} {profileUser.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {profileUser.occupation}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileUser.location}
              </Typography>
              {user._id !== userId && !isFriend && !isRequestSent && (
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleFriendRequest}
                  sx={{ mt: 2 }}
                >
                  Add Friend
                </Button>
              )}
              {user._id !== userId && isRequestSent && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAcceptFriend}
                  sx={{ mt: 2 }}
                >
                  Accept Friend Request
                </Button>
              )}
              {user._id !== userId && isFriend && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<PersonRemoveIcon />}
                  sx={{ mt: 2 }}
                >
                  Remove Friend
                </Button>
              )}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Friends
              </Typography>
              <Grid container spacing={2}>
                {profileUser.friends.map((friend) => (
                  <Grid item xs={4} key={friend._id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar src={friend.profilePicture} alt={`${friend.firstName} ${friend.lastName}`} />
                      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        {friend.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {posts.map((post) => (
            <Paper key={post._id} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={post.userId.profilePicture} alt={post.userId.firstName} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">
                    {post.userId.firstName} {post.userId.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ mb: 2 }}>{post.description}</Typography>
              {post.picturePath && (
                <Box
                  component="img"
                  src={post.picturePath}
                  alt="Post"
                  sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                />
              )}
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 