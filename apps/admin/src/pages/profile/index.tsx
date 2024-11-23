import { signOut } from '@common/api/auth';
import { Button } from '@common/components/ui/button';
import { LogOut } from 'lucide-react';

const daysOfWeek = [
  { day: 'L', emoji: '🥱', color: 'bg-[#C9C9FF]' },
  { day: 'M', emoji: '😭', color: 'bg-[#AADEFF]' },
  { day: 'W', emoji: '😡', color: 'bg-[#FFCCBB]' },
  { day: 'J', emoji: '😁', color: 'bg-[#FFFAAB]' },
  { day: 'V', emoji: '', color: 'bg-[#D4D4D4]' },
  { day: 'S', emoji: '', color: 'bg-[#D4D4D4]' },
  { day: 'D', emoji: '', color: 'bg-[#D4D4D4]' },
];

const ProfilePage = () => {
  return (
    <div className="min-h-svh bg-[linear-gradient(90deg,_#FFFBFB_0%,_#FCE4CB_25%,_#FCDDFD_50%,_#D9E0FF_75%,_#F2F4FF_100%)]">
      <div className="flex gap-2 items-center p-3 justify-between">
        <img src="https://avatars.dicebear.com/api/avataaars/mati.svg" alt="avatar" className="size-7 rounded-full" />
        <h1 className="font-bold text-sm w-full">Mati</h1>
        <Button size="icon" variant="ghost" onClick={signOut}>
          <LogOut />
        </Button>
      </div>
      <div className="flex px-2 py-3">
        <div className="flex gap-2 justify-between rounded-2xl w-full bg-white px-4 py-3">
          {daysOfWeek.map(({ day, emoji, color }, index) => (
            <div className="w-32 [&:nth-last-child(-n+3)]:text-neutral-300 flex flex-col items-center gap-1.5">
              <span className="font-bold text-[10px] leading-none">{day}</span>
              <div
                key={index}
                className={`flex flex-col items-center justify-center size-8 rounded-full ${color}`}
              >
                <span className="leading-none">{emoji}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white w-full flex flex-col gap-6 rounded-t-[24px] p-6">
        <h2 className="text-lg font-semibold">Este mes</h2>
        <h3 className="text-lg font-medium text-neutral-500">
          Lo mejor!
        </h3>
        <div className="-mt-2 flex bg-neutral-200/40 h-96 rounded-md w-full"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
