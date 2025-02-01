import HomePage from "./views/HomePage";
import StandingsPage from "./views/StandingsPage";
import LeagueManagementPage from "./views/LeagueManagementPage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeamPage";
import AnnouncementsPage from "./views/AnnouncementsPage";
import CreateAnnouncementsPage from "./views/CreateAnnouncementsPage";
import EditAnnouncementsPage from "./views/EditAnnouncementsPage";
import PlayersPage from "./views/PlayersPage";
import ProfilePage from "./views/ProfilePage";

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team", component: MyTeamPage },
  { path: "/standings", component: StandingsPage },
  { path: "/manage", component: LeagueManagementPage, private: true },
  { path: "/announcements", component: AnnouncementsPage },
  { path: "/announcements/edit/:id", component: EditAnnouncementsPage }, // private: true },
  { path: "/announcements/create", component: CreateAnnouncementsPage }, // private: true },
  { path: "/players", component: PlayersPage },
  { path: "/profile", component: ProfilePage },
];

export default routes;
