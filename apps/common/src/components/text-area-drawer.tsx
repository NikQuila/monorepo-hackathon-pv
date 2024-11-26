import * as React from 'react';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Textarea } from './ui/textarea';

interface TextAreaDrawerProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  disabled: boolean;
}

export function TextAreaDrawer({
  message,
  setMessage,
  handleSendMessage,
  disabled,
}: TextAreaDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      handleSendMessage();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size='lg'
          variant='secondary'
          className='rounded-full text-base font-normal h-10 bg-neutral-200/40 !hover:bg-black w-full'
        >
          Escribe
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form className='mx-auto p-2 w-full max-w-sm items-center flex flex-col' onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Escribe tu mensaje</DrawerTitle>
          </DrawerHeader>
          <div className='relative pb-4 w-full'>
            <Textarea
              placeholder='Escribe aquí...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              className='min-h-[70svh] leading-6 border-0 placeholder:text-neutral-500 z-40 pointer-events-auto focus-visible:ring-neutral-200/80'
            />
            <div className='absolute inset-0 flex flex-col mt-[7px] select-none pointer-events-none'>
              {Array(20)
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
          <Button disabled={disabled} className='px-8 w-full' variant="primary" type='submit'>
            {disabled ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
