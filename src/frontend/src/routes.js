import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import MyTeamPage from './views/MyTeamPage';

const routes = [
  { path: '/home', component: HomePage },
  { path: '/', component: LoginPage },
  { path: '/team', component: MyTeamPage },
];

export default routes;
