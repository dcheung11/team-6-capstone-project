import HomePage from "./views/HomePage";
import StandingsPage from "./views/StandingsPage";
import LeagueManagementPage from "./views/LeagueManagementPage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeamPage";
import AnnouncementsPage from './views/AnnouncementsPage';
import CommissionerAnnouncementsPage from './views/CommissionerAnnouncementsPage';
import CreateAnnouncementsPage from './views/CreateAnnouncementsPage';
import EditAnnouncementsPage from './views/EditAnnouncementsPage';

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team", component: MyTeamPage },
  { path: "/standings", component: StandingsPage },
  { path: "/manage", component: LeagueManagementPage, private: true },
  { path: '/announcements', component: AnnouncementsPage },
  { path: '/manage/announcements', component: CommissionerAnnouncementsPage },// private: true },
  { path: '/manage/announcements/edit/:id', component: EditAnnouncementsPage },// private: true },
  { path: '/manage/announcements/create', component: CreateAnnouncementsPage },// private: true },
];

export default routes;
