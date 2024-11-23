import { useState, useRef } from 'react';

import { Mic, MicOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import { Input } from '@common/components/ui/input';
import { Button } from '@common/components/ui/button';

type MessagePayload = {
  type: 'text' | 'audio';
  content: string | Blob;
  timestamp: number;
};

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

      const payload: MessagePayload = {
        type: 'audio',
        content: audioBlob,
        timestamp: Date.now(),
      };

      console.log('Sending audio payload:', payload);
      setAudioChunks([]);

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const payload: MessagePayload = {
        type: 'text',
        content: message.trim(),
        timestamp: Date.now(),
      };

      console.log('Sending text payload:', payload);
      setMessage('');
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle className='text-2xl'>Hablános</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-col items-center gap-4'>
            <Button
              size='lg'
              className={`rounded-full p-8 transition-all duration-200 ${
                isRecording && 'animate-pulse'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <MicOff className='h-8 w-8' />
              ) : (
                <Mic className='h-8 w-8' />
              )}
            </Button>
            {isRecording && (
              <span className='text-sm text-gray-500'>
                Grabando... (Click para detener)
              </span>
            )}
          </div>

          <div className='flex gap-2'>
            <Input
              placeholder='o también escribí acá...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='flex-1'
            />
            <Button onClick={handleSendMessage}>Escribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
