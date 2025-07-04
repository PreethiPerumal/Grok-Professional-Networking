import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import GlobalLayout from '../components/GlobalLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout><Login /></GlobalLayout>,
  },
  {
    path: '/login',
    element: <GlobalLayout><Login /></GlobalLayout>,
  },
  {
    path: '/signup',
    element: <GlobalLayout><Signup /></GlobalLayout>,
  },
  {
    path: '/profile',
    element: <GlobalLayout><ProfileView /></GlobalLayout>,
  },
  {
    path: '/profile/edit',
    element: <GlobalLayout><ProfileEdit /></GlobalLayout>,
  },
  {
    path: '/posts/create',
    element: <GlobalLayout><PostCreate /></GlobalLayout>,
  },
  {
    path: '/posts',
    element: <GlobalLayout><PostList /></GlobalLayout>,
  },
  {
    path: '/jobs',
    element: <GlobalLayout><JobList /></GlobalLayout>,
  },
  {
    path: '/messages',
    element: <GlobalLayout><MessageList /></GlobalLayout>,
  },
  {
    path: '/feed',
    element: <GlobalLayout><Feed /></GlobalLayout>,
  },
]); 