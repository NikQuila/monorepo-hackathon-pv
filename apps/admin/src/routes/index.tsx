import { Route, Switch } from 'wouter';
import RegisterAndCreateEntryPage from '../pages/onboarding';
import HomePage from '@/pages/home';
import JournalPage from '@/pages/journal';
import ChatPage from '@/pages/chat';

const RoutesConfig = () => (
  <Switch>
    <Route path='/register' component={RegisterAndCreateEntryPage} />
    <Route path='/journal' component={JournalPage} />
    <Route path='/' component={HomePage} />
    <Route path='/chat' component={ChatPage} />
    <Route component={() => <HomePage />} />
  </Switch>
);

export default RoutesConfig;
