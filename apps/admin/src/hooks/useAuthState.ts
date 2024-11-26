import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { fetchUserProfile } from 'common/src/api/users';
import useUserStore from '../store/useUserStore';
import { supabase } from 'common/src/supabase';
import { useLocation } from 'wouter';
import { signOut } from '@common/api/auth';

const useAuthState = () => {
  const { setUserProfile, userProfile } = useUserStore();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const fetchProfile = async (userId: string, retries = 3) => {
      let userData = null;
      const actualRoute = location;
      try {
        console.log('actualRoute', actualRoute);
        userData = await fetchUserProfile(userId);
        setUserProfile(userData);

        // Verificar si el usuario necesita ser redirigido a onboarding
        if (
          userData &&
          (!userData.name || !userData.age) &&
          actualRoute !== '/onboarding'
        ) {
          setLocation('/onboarding');
        }
      } catch (error) {
        if (retries > 0) {
          console.warn(
            `Retrying fetch user profile... Attempts left: ${retries}`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          fetchProfile(userId, retries - 1);
        } else {
          console.error('Error fetching user profile:', error);
          setLoading(false);
          setLocation('/onboarding');
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        console.log('No session found');
        setLoading(false);
        setSession(null);
        setUserProfile(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        console.log('No session found');
        setLoading(false);
        setSession(null);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUserProfile, setLocation]);

  return { session, loading };
};

export default useAuthState;
