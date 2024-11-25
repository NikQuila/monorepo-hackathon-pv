import { useEffect, useState } from 'react';
import { ArrowLeft, SendHorizontal, X } from 'lucide-react';
import { Button } from '@common/components/ui/button';
import { Textarea } from '@common/components/ui/textarea';
import { getAiInsight } from '@common/api/chat';
import useUserStore from '@/store/useUserStore';
import { useLocation } from 'wouter';
import LoadingMessages from '@common/components/ui/loading-messages';

const loadingMessages = [
  'Consulta a tu yo interior 🧠',
  '¿Qué te preocupa? 🤔',
  '¿Cómo te sientes? ✍️',
  '¿Qué te gustaría saber? 📖',
]

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const ChatPage = () => {
  const { userProfile } = useUserStore();
  const [location, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const initialPrompt = params.get('prompt');

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAiInsight(
        userProfile?.id as string,
        textToSend
      );
      console.log('response', response);

      const aiResponse: Message = {
        id: Date.now().toString(),
        content: response.data.answer,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (initialPrompt && !initialPromptSent) {
    handleSendMessage(initialPrompt);
    setInitialPromptSent(true);
  }

  return (
    <div className='fixed z-50 max-w-md mx-auto w-screen flex flex-col h-svh bg-brandgradient'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div className="flex justify-end -m-1">
          <Button
            onClick={() => setLocation('/profile')}
            size='icon'
            variant='ghost'
            className="[&_svg]:size-6 text-neutral-400"
          >
            <X />
          </Button>
        </div>
        {!messages.length && (
          <div className="mx-auto flex flex-col gap-6 animate-pulse h-full pb-24 text-neutral-500 text-sm text-center items-center justify-center">
            <img src='/isotipo.svg' alt='Yournal' className='h-16 grayscale w-auto' />
            <LoadingMessages
              messages={loadingMessages}
              interval={3000}
            />
            <p className="mt-4 max-w-56 text-balance text-center">Pregúntale a tus pensamientos, y consigue insights.</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl break-words ${
                message.isUser
                  ? 'bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] text-neutral-800'
                  : 'bg-neutral-200/40 text-neutral-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-neutral-200/40 animate-pulse text-neutral-400 max-w-[80%] p-3 rounded-2xl'>
              Escribiendo...
            </div>
          </div>
        )}
      </div>

      <div className='p-2 border-t bg-white/50 backdrop-blur-sm'>
        <div className='flex gap-2 max-w-3xl mx-auto'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Escribe tu mensaje...'
            className='resize-none pt-2.5 h-12 bg-white/80'
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            size='icon'
            className='size-12 [&_svg]:size-5 aspect-square bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] text-neutral-800 hover:opacity-90'
          >
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
