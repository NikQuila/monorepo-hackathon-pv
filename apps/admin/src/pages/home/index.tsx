import { useState } from 'react';
import Chat from '@/sections/home/chat';
import Onboarding from '@/sections/home/onboarding';
import useUserStore from '@/store/useUserStore';

type Step = 'name' | 'chat';

const HomePage = () => {
  const { userProfile } = useUserStore();
  console.log(userProfile);

  if (userProfile?.name && userProfile?.age) {
    return <Chat />;
  }

  return <Onboarding />;
};

export default HomePage;
