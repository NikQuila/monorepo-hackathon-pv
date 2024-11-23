import { DateTime } from 'luxon';
import { Card, CardContent } from '@common/components/ui/card';
import { Skeleton } from '@common/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchJournalEntries } from '@common/api/journals';

const JournalPage = () => {
  const today = DateTime.now();
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      const startDate = today.minus({ days: 3 });
      const endDate = today.plus({ days: 3 });
      const data = await fetchJournalEntries(startDate, endDate);
      setEntries(data);
      setLoading(false);
    };

    loadEntries();
  }, [today]);

  const getDayInitial = (date: DateTime) =>
    date
      .toLocaleString({ weekday: 'short' }, { locale: 'es' })
      .charAt(0)
      .toUpperCase();

  const getDate = (date: DateTime) => date.toFormat('d');

  const weekDays = [
    ...Array(3)
      .fill(null)
      .map((_, i) => today.minus({ days: 3 - i })),
    today,
    ...Array(3)
      .fill(null)
      .map((_, i) => today.plus({ days: i + 1 })),
  ];

  const handleDayClick = (date: DateTime) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate.toFormat('yyyy-MM-dd');
  const entryContent =
    entries[formattedDate] || 'No hay entrada para este día.';

  return (
    <div className='max-w-2xl mx-auto p-4 space-y-6 pb-20'>
      {/* Week Calendar Strip */}
      <div className='flex justify-between items-center bg-slate-50 p-4 rounded-xl'>
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-colors ${
              day.hasSame(selectedDate, 'day')
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className='text-xs font-medium'>{getDayInitial(day)}</span>
            <span className='text-lg'>{getDate(day)}</span>
          </button>
        ))}
      </div>

      {/* Journal Entry Area */}
      <Card className='bg-white shadow-sm'>
        <CardContent className='p-6'>
          <div className='space-y-6'>
            <div className='text-sm text-gray-500'>
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
            <div className='relative'>
              {/* Líneas de fondo */}
              <div
                className='absolute inset-0 flex flex-col'
                style={{ marginTop: '1.5rem' }}
              >
                {Array(15)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className='border-b border-slate-100'
                      style={{ height: '2rem' }}
                    />
                  ))}
              </div>
              {/* Contenido */}
              <div
                className='relative whitespace-pre-wrap text-gray-700 leading-8'
                style={{ minHeight: '30rem' }}
              >
                {entryContent}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalPage;
