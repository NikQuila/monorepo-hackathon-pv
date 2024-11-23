import { useEffect, useState } from 'react';
import Chat from '@/sections/home/chat';
import Onboarding from '@/sections/home/onboarding';
import useUserStore from '@/store/useUserStore';
import { supabase } from '@common/supabase';

type Step = 'name' | 'chat';

const HomePage = () => {
  const { userProfile } = useUserStore();
  console.log(userProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*, hechos(*)') // Aquí traemos todos los datos del user y su relación con hechos
        .eq('id', userProfile?.id); // Filtra por el id del usuario que quieres obtener

      console.log('data', data);
    };

    fetchUserProfile();
  }, [userProfile]);

  if (userProfile?.name && userProfile?.age) {
    return <Chat />;
  }

  return <Onboarding />;
};

export default HomePage;
