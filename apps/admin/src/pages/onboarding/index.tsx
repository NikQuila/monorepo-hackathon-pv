import { useEffect, useState } from 'react';
import Chat from '@/sections/home/chat';
import Onboarding from '@/sections/home/onboarding';
import useUserStore from '@/store/useUserStore';
import { supabase } from '@common/supabase';

type Step = 'name' | 'chat';

const RegisterAndCreateEntryPage = () => {
  const { userProfile } = useUserStore();

  if (userProfile?.name && userProfile?.age) {
    return <Chat />;
  }

  return <Onboarding />;
};

export default RegisterAndCreateEntryPage;
