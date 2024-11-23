import { useState } from 'react';
import Chat from '@/sections/home/chat';
import Onboarding from '@/sections/home/onboarding';
import useUserStore from '@/store/useUserStore';
import { signOut } from '@common/api/auth';

type Step = 'name' | 'chat';

const HomePage = () => {
  const [step, setStep] = useState<Step>('name');
  const { clearUserProfile, userProfile } = useUserStore();
  console.log(userProfile);

  if (userProfile?.name && userProfile?.age) {
    return <Chat />;
  }

  return <Onboarding />;
};

export default HomePage;
