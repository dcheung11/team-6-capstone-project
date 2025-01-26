import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import AnnouncementsPage from './views/AnnouncementsPage';
import MyTeamPage from './views/MyTeamPage';

const routes = [
  { path: '/', component: LoginPage }, 
  { path: '/home', component: HomePage },
  { path: '/announcements', component: AnnouncementsPage },
  { path: '/team', component: MyTeamPage },
];

export default routes;
