import { DateTime } from 'luxon';
import { Card, CardContent } from '@common/components/ui/card';
import { useState } from 'react';
import { ScrollArea } from '@common/components/ui/scroll-area';
import { Button } from '@common/components/ui/button';
import BlurFade from '@common/components/ui/blur-fade';

const mockEntries: Record<string, string> = {
  '2024-11-22': `Hoy fue uno de esos días en los que el tiempo parece moverse con calma, pero a la vez logré hacer más de lo que esperaba. Me desperté temprano y aproveché la mañana para trabajar en un proyecto personal que he estado postergando.

Es increíble cómo, cuando me siento inspirado, las ideas fluyen casi sin esfuerzo. Dedicarle ese tiempo fue realmente gratificante.

Por la tarde, salí a dar un paseo. El aire fresco y la tranquilidad del entorno me ayudaron a despejar la mente. Hay algo especial en caminar sin rumbo fijo, dejando que los pensamientos vayan y vengan sin presión.`,
  '2024-11-21':
    'Un día productivo en la oficina. Completé varios pendientes importantes.',
  '2024-11-20':
    'Cena familiar. Fue agradable reconectarnos después de tanto tiempo.',
};

const JournalPage = () => {
  const today = DateTime.now();
  const [selectedDate, setSelectedDate] = useState(today);

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
    mockEntries[formattedDate] || 'No hay entrada para este día.';

  return (
    <div className='max-w-96 mx-auto'>
      <div className='sticky top-0 z-10 flex flex-col gap-4 justify-between items-center bg-neutral-100 py-4'>
        <div className="w-full flex justify-between px-3">
          {weekDays.map((day, index) => (
            <div className="w-8 flex flex-col gap-1.5 items-center" key={index}>
              <span className='text-[10px] font-bold'>{getDayInitial(day)}</span>
              <button
                onClick={() => handleDayClick(day)}
                className={`flex flex-col gap-1.5 items-center justify-center size-7 rounded-full transition-colors ${
                  day.hasSame(selectedDate, 'day')
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-400'
                }`}
              >
                <span className='text-sm font-bold'>{getDate(day)}</span>
              </button>
            </div>
          ))}
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

      <ScrollArea className='bg-white px-3 pt-6 pb-40'>
        <div className='space-y-6'>
          <div className='relative'>
            {entryContent === 'No hay entrada para este día.' ? (
              <>
                <div className="fixed top-1/2 -translate-y-1/2 inset-x-4 text-center flex flex-col gap-3 z-10 mx-2 bg-neutral-100 rounded-3xl px-8 pt-12 pb-10">
                  <span className="text-sm text-neutral-900">Hoy</span>
                  <h1 className="text-xl font-semibold text-neutral-900">
                    No has escrito nada todavía.
                  </h1>
                  <p className="text-base text-neutral-600">
                    Cuéntanos sobre algo para poder entender mejor cómo ayudarte.
                  </p>
                  <Button variant="primary" className="mt-3">
                    Cuéntame algo
                  </Button>
                </div>
                <div
                  className='fixed inset-0 top-28 mx-4 flex flex-col'
                >
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
              </>
            ) : (
              <>
                <div
                  className='relative whitespace-pre-wrap text-neutral-700 leading-8'
                  style={{ minHeight: '30rem' }}
                >
                  {entryContent}
                </div>
              </>
            )}
            <div className="bg-gradient-to-t from-white to-transparent w-screen h-24 fixed bottom-20 inset-x-0 z-10" />
            <div
              className='absolute inset-0 flex flex-col -mt-0.5'
            >
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
