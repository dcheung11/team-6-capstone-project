import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import MyTeamPage from "./views/MyTeamPage";
import StandingsPage from "./views/StandingsPage";

const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LoginPage },
  { path: "/team", component: MyTeamPage },
  { path: "/standings", component: StandingsPage },
];

export default routes;
