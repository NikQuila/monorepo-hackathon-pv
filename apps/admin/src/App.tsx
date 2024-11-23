import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import RoutesConfig from './routes';
import useAuthState from './hooks/useAuthState';
import AuthPage from './pages/auth';
import { BottomNav } from '@common/components/bottom-nav';

const App = () => {
  const { session, loading } = useAuthState();

  if (loading) return null;

  if (!session) return <AuthPage />;

  return (
    <div className='min-h-screen'>
      <ToastContainer />
      <main className='container mx-auto px-4 pb-16'>
        <RoutesConfig />
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
