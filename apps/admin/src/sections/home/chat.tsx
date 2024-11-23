import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import { Input } from '@common/components/ui/input';
import { Button } from '@common/components/ui/button';
import { sendJournalFastResponse, sendMessageOrAudio } from '@common/api/chat';
import { supabase } from '@common/supabase';
import useUserStore from '@/store/useUserStore';

type MessagePayload = {
  type: 'text' | 'audio';
  content: string | Blob;
  timestamp: number;
  user_id: string | number;
};

interface FastResponse {
  title: string;
  description: string;
  mood_emoji: string;
  recommendations: {
    activity: string;
    duration: string;
  }[];
}

export default function Chat() {
  const { userProfile } = useUserStore();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [fastResponse, setFastResponse] = useState<FastResponse | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/wav',
      'audio/ogg',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return ''; // fallback to browser default
  };

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      setRecordedAudio(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false, // explicitly set video to false
      });

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // More detailed error handling
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error(
            'Por favor permite el acceso al micrófono para grabar audio'
          );
        } else if (error.name === 'NotFoundError') {
          toast.error('No se encontró ningún micrófono en el dispositivo');
        } else {
          toast.error(`Error al acceder al micrófono: ${error.message}`);
        }
      } else {
        toast.error('Error inesperado al acceder al micrófono');
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/wav';
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        setRecordedAudio(audioBlob);
        setAudioChunks([]);
      };

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  const handleSubmitAudio = async () => {
    if (!recordedAudio) return;

    setLoading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileName = `audio_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, recordedAudio);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: publicData } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      console.log('🚀 URL pública:', publicData.publicUrl);

      // 3. Prepare payload
      const payload = {
        type: 'audio',
        content: publicData.publicUrl,
        timestamp: Date.now(),
        user_id: userProfile?.id as string,
      };

      // 4. Call both endpoints simultaneously
      const [fastResponseResult] = await Promise.all([
        sendJournalFastResponse(payload),
        sendMessageOrAudio(payload), // We still call this but don't wait for the result
      ]);

      // 5. Set fast response to show UI
      setFastResponse(fastResponseResult);
      toast.success('¡Gracias por subir tu journal!');
    } catch (error) {
      console.error('Error submitting audio:', error);
      toast.error('Error al enviar el audio');
    } finally {
      setLoading(false);
      setRecordedAudio(null);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      try {
        const payload: MessagePayload = {
          type: 'text',
          content: message.trim(),
          timestamp: Date.now(),
          user_id: userProfile?.id as string,
        };

        console.log('Sending text payload:', payload);
        const [fastResponseResult] = await Promise.all([
          sendJournalFastResponse(payload),
          sendMessageOrAudio(payload),
        ]);

        setFastResponse(fastResponseResult);
        setMessage('');
        toast.success('¡Gracias por subir tu journal!');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Error al enviar el mensaje');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      {fastResponse ? (
        <FastResponseUI response={fastResponse} />
      ) : (
        <>
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
                  disabled={loading}
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
                {recordedAudio && !isRecording && (
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-sm text-gray-500'>
                      Audio grabado y listo para enviar
                    </span>
                    <Button
                      onClick={handleSubmitAudio}
                      className='bg-green-600 hover:bg-green-700'
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar Journal'}
                    </Button>
                  </div>
                )}
              </div>

              <div className='flex gap-2'>
                <Input
                  placeholder='o también escribí acá...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='flex-1'
                  disabled={loading}
                />
                <Button onClick={handleSendMessage} disabled={loading}>
                  Escribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

const FastResponseUI = ({ response }: { response: FastResponse }) => {
  return (
    <Card className='w-full max-w-xl mx-auto mt-8'>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <div className='text-4xl'>{response.mood_emoji}</div>
          <CardTitle>{response.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <p className='text-gray-600'>{response.description}</p>

        {response.recommendations.length > 0 && (
          <div className='space-y-4'>
            <h3 className='font-semibold'>Recomendaciones:</h3>
            <div className='grid gap-3'>
              {response.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 rounded-lg bg-gray-50'
                >
                  <span>{rec.activity}</span>
                  <span className='text-sm text-gray-500'>{rec.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
