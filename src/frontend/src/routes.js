import HomePage from "./views/HomePage";
import StandingsPage from "./views/StandingsPage";
import LeagueManagementPage from "./views/LeagueManagementPage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeamPage";
import AnnouncementsPage from "./views/AnnouncementsPage";
import CreateAnnouncementsPage from "./views/CreateAnnouncementsPage";
import EditAnnouncementsPage from "./views/EditAnnouncementsPage";
import RegisterTeamPage from "./views/RegisterTeamPage";
import PlayersPage from "./views/PlayersPage";
import ProfilePage from "./views/ProfilePage";
import InfoPage from "./views/InfoPage";
import SchedulePage from "./views/SchedulePage";

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team/:id", component: MyTeamPage },
  { path: "/standings", component: StandingsPage },
  { path: "/manage", component: LeagueManagementPage, private: true },
  { path: "/announcements", component: AnnouncementsPage },
  { path: "/announcements/edit/:id", component: EditAnnouncementsPage }, // private: true },
  { path: "/announcements/create", component: CreateAnnouncementsPage }, // private: true },
  { path: "/registerteam/:id", component: RegisterTeamPage },
  { path: "/players", component: PlayersPage },
  { path: "/profile", component: ProfilePage },
  { path: "/info", component: InfoPage },
  { path: "/schedule", component: SchedulePage },
];

export default routes;
