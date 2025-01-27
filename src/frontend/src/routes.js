import HomePage from "./views/HomePage";
import LeagueManagementPage from "./views/LeagueManagementPage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeamPage";
import AnnouncementsPage from './views/AnnouncementsPage';

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team", component: MyTeamPage },
  { path: "/manage", component: LeagueManagementPage },
  { path: '/announcements', component: AnnouncementsPage },
];

export default routes;
