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
import ScheduleView from "./views/ScheduleView";
import RescheduleResponsePage from "./views/RescheduleResponsePage";
import DocumentationPage from "./views/DocumentationPage";
import WaiverPage from "./views/WaiverPage";

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team/", component: MyTeamPage },
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
  { path: "/schedule", component: ScheduleView },
  { path: "/notifications/:notificationId/reschedule-requests/:rescheduleRequestId", component: RescheduleResponsePage },
  { path: "/documentation", component: DocumentationPage },
  { path: "/waiver", component: WaiverPage },
];

export default routes;
