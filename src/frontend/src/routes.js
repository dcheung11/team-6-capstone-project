import { Announcement } from '@mui/icons-material';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import AnnouncementsPage from './views/AnnouncementsPage';

const routes = [
  { path: '/', component: LoginPage }, 
  { path: '/home', component: HomePage },
  { path: '/announcements', component: AnnouncementsPage },
];

export default routes;
