import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { fetchJournalEntries } from '@common/api/journals';
import { Button } from '@common/components/ui/button';
import WeekdayCarousel from './weekdayCarousel';
import { ScrollArea } from '@common/components/ui/scroll-area';
import useUserStore from '@/store/useUserStore';
import { Skeleton } from '@common/components/ui/skeleton';

const JournalPage = () => {
  const { userProfile } = useUserStore();
  const today = DateTime.now();
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);

      const startDate = today.startOf("week").minus({ week: 1 });
      const endDate = today.endOf("week").plus({ week: 1 });

      const data = await fetchJournalEntries(
        startDate,
        endDate,
        userProfile?.id as string
      );
      setEntries(data);
      setLoading(false);
    };

    loadEntries();
  }, [userProfile]);

  const generateWeeks = (startDate: DateTime, endDate: DateTime): DateTime[][] => {
    const weeks: DateTime[][] = [];
    let current = startDate.startOf("week");

    while (current <= endDate) {
      weeks.push(
        Array(7)
          .fill(0)
          .map((_, i) => current.plus({ days: i }))
      );
      current = current.plus({ weeks: 1 });
    }

    return weeks;
  };

  const startDate = today.startOf("month");
  const endDate = today.endOf("month");
  const weeks = generateWeeks(startDate, endDate);

  const handleDayClick = (date: DateTime) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate.toFormat("yyyy-MM-dd");
  const entryContent = entries[formattedDate] || "No hay entrada para este día.";


  if (loading) {
    return (
      <div className='mx-auto max-w-md'>
        <div className='sticky top-0 z-10 flex flex-col gap-4 justify-between items-center bg-neutral-100 py-4'>
          <div className='w-full flex justify-between px-3'>
            {[...Array(7)].map((_, index) => (
              <div
                className='w-8 flex flex-col gap-1.5 items-center'
                key={index}
              >
                <Skeleton className='h-3 w-3' />
                <Skeleton className='size-7 rounded-full' />
              </div>
            ))}
          </div>
          <Skeleton className='h-4 w-48' />
        </div>

        {/* Content Area Skeleton */}
        <div className='px-3 pt-6 pb-40'>
          <div className='space-y-6'>
            <div className='relative'>
              <div className='max-w-md mx-auto fixed top-1/2 -translate-y-1/2 inset-x-6 text-center flex flex-col gap-3 z-10 bg-neutral-100 rounded-3xl px-8 pt-12 pb-10'>
                <Skeleton className='h-4 w-16 mx-auto' /> {/* "Hoy" text */}
                <Skeleton className='h-6 w-64 mx-auto' /> {/* Title */}
                <Skeleton className='h-4 w-full' /> {/* Description */}
                <Skeleton className='h-10 w-full mt-3' /> {/* Button */}
              </div>

              {/* Background lines */}
              <div className='fixed max-w-md inset-0 top-28 px-4 mx-auto flex flex-col'>
                {Array(15)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className='border-b border-neutral-200/60'
                      style={{ height: '2rem' }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto'>
      <div className='sticky top-0 z-10 flex flex-col gap-4 justify-between items-center bg-neutral-100 py-4'>
        <div className='w-full flex justify-between px-3'>
          <WeekdayCarousel
            weeks={weeks}
            selectedDate={selectedDate}
            handleDayClick={handleDayClick}
          />
        </div>
        <div className='text-xs font-medium text-neutral-400'>
          {selectedDate
            .toLocaleString(
              {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              },
              { locale: 'es' }
            )
            .toUpperCase()}
        </div>
      </div>

      <ScrollArea className='px-3 pt-6 pb-40'>
        <div className='space-y-6'>
          <div className='relative'>
            {entryContent === 'No hay entrada para este día.' ? (
              <>
                <div className='max-w-96 mx-auto fixed top-1/2 -translate-y-1/2 inset-x-3 text-center flex flex-col gap-3 z-10 bg-neutral-100 rounded-3xl px-4 pt-12 pb-10'>
                  <h1 className='text-xl font-semibold text-neutral-900'>
                    No has escrito nada todavía.
                  </h1>
                  <p className='text-base text-neutral-600'>
                    Cuéntanos sobre algo para poder entender mejor cómo
                    ayudarte.
                  </p>
                  <Button variant='primary' className='mt-3'>
                    <a href="/">
                      Cuéntame algo
                    </a>
                  </Button>
                </div>
                <div className='fixed max-w-md px-2 mx-auto inset-0 top-28 flex flex-col'>
                  {Array(26)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className='border-b border-neutral-200/60'
                        style={{ height: '2rem' }}
                      />
                    ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className='relative whitespace-pre-wrap text-neutral-700 leading-8'
                  style={{ minHeight: '30rem' }}
                >
                  {entryContent.replace(/-/g, '')}
                </div>
              </>
            )}
            <div className='bg-gradient-to-t from-white to-transparent w-screen h-24 fixed bottom-16 inset-x-0 z-10' />
            <div className='absolute inset-0 flex flex-col -mt-0.5'>
              {Array(15)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className='border-b border-neutral-200/60'
                    style={{ height: '2rem' }}
                  />
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default JournalPage;
