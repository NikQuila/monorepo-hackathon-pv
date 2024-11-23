import { DateTime } from 'luxon';
import { Card, CardContent } from '@common/components/ui/card';
import { useState } from 'react';

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
    <div className='max-w-2xl mx-auto p-4 space-y-6'>
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
