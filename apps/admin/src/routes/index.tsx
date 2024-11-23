import { Route, Switch } from 'wouter';
import HomePage from '../pages/home';
import ProfilePage from '@/pages/profile';
import JournalPage from '@/pages/journal';

const RoutesConfig = () => (
  <Switch>
    <Route path='/' component={HomePage} />
    <Route path='/journal' component={JournalPage} />
    <Route path='/profile' component={ProfilePage} />
  </Switch>
);

export default RoutesConfig;
