import { useState, useRef } from 'react';
import { Button } from '@common/components/ui/button';
import { Input } from '@common/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import { Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Referencias para manejar la grabación
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      // Solicitar permisos de micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          setMessage((prev) => prev + ' ' + transcriptText);
        } else {
          setTranscript(transcriptText);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

      // Configurar el grabador de audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsRecording(false);
    setTranscript('');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Text message:', message);
      setMessage('');
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-slate-50'>
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle className='text-2xl'>Cuéntame sobre tu día</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              placeholder='Si prefieres puedes escribir aquí...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='flex-1'
            />
            <Button
              onClick={handleSendMessage}
              className='bg-pink-600 hover:bg-pink-700'
            >
              Enviar
            </Button>
          </div>

          {transcript && (
            <div className='text-sm text-gray-500 italic'>{transcript}...</div>
          )}

          <div className='flex flex-col items-center gap-4'>
            <Button
              size='lg'
              className={`rounded-full p-8 transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-pink-600 hover:bg-pink-700'
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
        </CardContent>
      </Card>
    </div>
  );
}
