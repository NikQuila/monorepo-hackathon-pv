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
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchProfile = async (userId: string, retries = 3) => {
      try {
        const userData = await fetchUserProfile(userId);
        setUserProfile(userData);

        if (userData && (!userData.name || !userData.age)) {
          setLocation('/');
        }
      } catch (error) {
        if (retries > 0) {
          console.warn(
            `Retrying fetch user profile... Attempts left: ${retries}`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
          fetchProfile(userId, retries - 1);
        } else {
          console.error('Error fetching user profile:', error);
          setLoading(false);
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
