import { useEffect, useState } from 'react';
import useUserStore from '@/store/useUserStore';
import { signOut } from '@common/api/auth';
import { Button } from '@common/components/ui/button';
import {
  Book,
  LogOut,
  Mic,
  Pen,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useLocation } from 'wouter';
import {
  fetchUserProfile,
  analyzeMood,
  getRecommendations,
  getGoodHabits,
  getDoBetterRecommendations,
  GoodHabits,
  GoodHabit,
} from '@common/api/users';
import { Skeleton } from '@common/components/ui/skeleton';
import Ripple from '@common/components/ui/ripple';
import { cn } from '@/lib/utils';
import HelpStepper from './help-stepper';

const icons = [Pen, Mic, Book, Star];

const conversationPrompts = [
  {
    text: '¿Qué cosas me hacen bien?',
    color: 'bg-[#FCE4CB]',
  },
  {
    text: '¿Qué cosas me hacen mal?',
    color: 'bg-[#FCDDFD]',
  },
  {
    text: '¿Qué cosas me gustaría mejorar?',
    color: 'bg-[#D9E0FF]',
  },
];

const HomePage = () => {
  const { userProfile } = useUserStore();
  const [mood, setMood] = useState('');
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<{ mensaje: string }[]>(
    []
  );
  const [goodHabits, setGoodHabits] = useState<GoodHabit[]>([]);
  const [dobetterHabits, setDobetterHabits] = useState<{ mensaje: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!userProfile?.id) return;

      try {
        setLoading(true);
        const [recommendationsResult, goodHabitsResult, dobetterResult] =
          await Promise.all([
            getRecommendations(userProfile.id),
            getGoodHabits(userProfile.id),
            getDoBetterRecommendations(userProfile.id),
          ]);

        setRecommendations(recommendationsResult);
        setGoodHabits(goodHabitsResult.goodhabits);
        setDobetterHabits(dobetterResult);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userProfile?.id]);

  return (
    <div className='bg-[linear-gradient(180deg,#Fce6cf_0%,_#fbcffc_10%,_#CCd5ff_20%)]'>
      <div className='z-50 top-0 inset-0 flex gap-2 items-center p-3 justify-between'>
        <HelpStepper />
        <Button
          size='icon'
          variant='ghost'
          className='shrink-0 [&_svg]:size-5 hover:bg-transparent text-black/40'
          onClick={signOut}
        >
          <LogOut />
        </Button>
      </div>

      <div className='min-h-[65svh] justify-center h-full flex flex-col items-center'>
        <div
          onClick={() => setLocation('/chat')}
          className='pt-16 flex flex-col items-center gap-4 relative mt-16 h-40'
        >
          <Ripple
            numCircles={3}
            mainCircleSize={128}
            mainCircleOpacity={0.9}
            color={'bg-white'}
            className={'animate-ripple'}
          />
          <div
            className={cn(
              'absolute z-50 [&_svg]:size-14 [&_svg]:stroke-1 shrink-0 *:shrink-0 -translate-x-1/2 -translate-y-1/2 mt-4 rounded-full flex items-center justify-center size-full p-8 transition-all duration-200',
              'text-neutral-800 top-0 left-0'
            )}
          >
            <Mic />
          </div>
        </div>
        <div className='px-4 py-3'>
          <p className='text-neutral-100 text-3xl text-center pb-4'>
            ¿De qué quieres hablar?
          </p>
          <div className='flex flex-col gap-2 w-full pt-3 pb-4'>
            {conversationPrompts.map(({ text, color }, index) => (
              <div
                key={index}
                onClick={() => setLocation(`/chat?prompt=${text}`)}
                className={`w-full h-12 bg-white/25 backdrop-blur-md font-bold text-sm flex items-center justify-center rounded-md shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]`}
              >
                <span className='text-sm font-medium text-neutral-800'>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='bg-white w-full h-full flex flex-col gap-6 rounded-t-[24px] pt-8 pb-16 p-6'>
        <h2 className='text-lg font-semibold'>Sobre ti</h2>
        {loading ? (
          <>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-32' />
              <div className='space-y-2'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className='h-14 w-full rounded-lg' />
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <Skeleton className='h-6 w-32' />
              <div className='space-y-2'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className='h-14 w-full rounded-lg' />
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <Skeleton className='h-6 w-32' />
              <div className='space-y-2'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className='h-14 w-full rounded-lg' />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-neutral-500'>
                Recomendaciones
              </h3>
              <div className='space-y-2 pb-8'>
                {recommendations?.length > 0 ? (
                  recommendations.map((recommendation, index) => {
                    const RandomIcon =
                      icons[Math.floor(Math.random() * icons.length)];
                    return (
                      <div
                        key={index}
                        className={cn(
                          'flex bg-white text-neutral-800 items-center text-sm text-left gap-3 font-medium p-2 pr-3 rounded-lg border',
                          'shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
                        )}
                      >
                        <div
                          className={cn(
                            'size-8 bg-neutral-100 flex [&_svg]:size-5 items-center justify-center rounded-md shrink-0 aspect-square'
                          )}
                        >
                          <RandomIcon />
                        </div>
                        <span className='text-neutral-800'>
                          {recommendation.mensaje.charAt(0).toUpperCase() +
                            recommendation.mensaje.slice(1)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className='text-neutral-500'>No tienes recomendaciones</p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-neutral-500'>
                Buenos hábitos
              </h3>
              <div className='space-y-2 pb-8'>
                {goodHabits?.length > 0 ? (
                  goodHabits?.map((habit, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex bg-green-100 border-green-200 text-neutral-800 items-center text-sm text-left gap-3 font-medium p-2 pr-3 rounded-lg border',
                        'shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
                      )}
                    >
                      <div
                        className={cn(
                          'size-8 bg-green-200 text-green-600 flex [&_svg]:size-5 items-center justify-center rounded-md shrink-0 aspect-square'
                        )}
                      >
                        <ThumbsUp />
                      </div>
                      <span className='text-neutral-800'>{habit.mensaje}</span>
                    </div>
                  ))
                ) : (
                  <p className='text-neutral-500'>No tienes buenos hábitos</p>
                )}
              </div>
            </div>

            <div className='space-y-4 pb-20'>
              <h3 className='text-lg font-medium text-neutral-500'>
                Hábitos por mejorar
              </h3>
              <div className='space-y-2 pb-8'>
                {dobetterHabits?.length > 0 ? (
                  dobetterHabits?.map((habit, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex bg-red-100 border-red-200 text-neutral-800 items-center text-sm text-left gap-3 font-medium p-2 pr-3 rounded-lg border',
                        'shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
                      )}
                    >
                      <div
                        className={cn(
                          'size-8 bg-red-200 text-red-600 flex [&_svg]:size-5 items-center justify-center rounded-md shrink-0 aspect-square'
                        )}
                      >
                        <ThumbsDown />
                      </div>
                      <span className='text-neutral-800'>{habit.mensaje}</span>
                    </div>
                  ))
                ) : (
                  <p className='text-neutral-500'>No tienes áreas de mejora</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
