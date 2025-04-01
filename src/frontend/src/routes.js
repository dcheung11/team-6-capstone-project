// Author: Pitch Perfect
// Description: This file contains the routes for the application.
// Last Modified: 2025-02-01

import HomePage from "./views/Home/HomePage";
import StandingsPage from "./views/StandingsPage";
import LeagueManagementPage from "./views/LeagueManagementPage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeam/MyTeamPage";
import AnnouncementsPage from "./views/Announcements/AnnouncementsPage";
import CreateAnnouncementsPage from "./views/Announcements/CreateAnnouncementsPage";
import EditAnnouncementsPage from "./views/Announcements/EditAnnouncementsPage";
import RegisterTeamPage from "./views/Home/RegisterTeamPage";
import PlayersPage from "./views/MyTeam/PlayersPage";
import ProfilePage from "./views/ProfilePage";
import InfoPage from "./views/InfoPage";
import ScheduleView from "./views/Schedule/ScheduleView";
import RescheduleResponsePage from "./views/Reschedule/RescheduleResponsePage";
import DocumentationPage from "./views/DocumentationPage";
import WaiverPage from "./views/MyTeam/WaiverPage";

// This file contains the routes for the application.
// Each route is an object with a path and a component.
// The path is the URL path for the route, and the component is the React component to render for that route.
// The routes are used in the App.js file to set up the routing for the application.

const routes = [
  { path: "/home", component: HomePage, private: true },
  { path: "/", component: LoginPage },
  { path: "/team/", component: MyTeamPage, private: true },
  { path: "/team/:id", component: MyTeamPage, private: true },
  { path: "/standings", component: StandingsPage, private: true },
  { path: "/manage", component: LeagueManagementPage, private: true },
  { path: "/announcements", component: AnnouncementsPage, private: true },
  { path: "/announcements/edit/:id", component: EditAnnouncementsPage, private: true },
  { path: "/announcements/create", component: CreateAnnouncementsPage, private: true },
  { path: "/registerteam/:id", component: RegisterTeamPage, private: true },
  { path: "/players", component: PlayersPage, private: true },
  { path: "/profile", component: ProfilePage, private: true },
  { path: "/info", component: InfoPage },
  { path: "/schedule", component: ScheduleView, private: true },
  { path: "/notifications/:notificationId/reschedule-requests/:rescheduleRequestId", component: RescheduleResponsePage, private: true },
  { path: "/documentation", component: DocumentationPage },
  { path: "/waiver", component: WaiverPage, private: true },
];

export default routes;
