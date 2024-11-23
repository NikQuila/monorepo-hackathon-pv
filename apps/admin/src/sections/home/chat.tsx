import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@common/components/ui/button';
import { sendMessageOrAudio } from '@common/api/chat';
import { supabase } from '@common/supabase';
import Ripple from '@common/components/ui/ripple';
import { TextAreaDrawer } from '@common/components/text-area-drawer';
import { cn } from '@/lib/utils';

type MessagePayload = {
  type: 'text' | 'audio';
  content: string | Blob;
  timestamp: number;
};

export default function Chat() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // New state for paused
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

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
    return '';
  };

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      setRecordedAudio(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
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
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
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
    setIsPaused(false);
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setIsRecording(true);
    }
  };

  const handleSubmitAudio = async () => {
    if (!recordedAudio) return;

    setLoading(true);
    try {
      const fileName = `audio_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, recordedAudio);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      console.log('🚀 URL pública:', publicData.publicUrl);

      const payload: MessagePayload = {
        type: 'audio',
        content: publicData.publicUrl,
        timestamp: Date.now(),
      };

      console.log('Sending audio payload:', payload);
      await sendMessageOrAudio(payload);

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
      const payload: MessagePayload = {
        type: 'text',
        content: message.trim(),
        timestamp: Date.now(),
      };

      console.log('Sending text payload:', payload);
      await sendMessageOrAudio(payload);
      setMessage('');
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else if (isPaused) {
      resumeRecording();
    } else {
      startRecording();
    }
  };


  return (
    <div className='flex flex-col items-center fixed inset-0 z-50 bg-brandgradient'>
      <div className="relative h-full min-h-screen w-full max-w-96 p-12 justify-between flex items-center flex-col">
        <h1 className="text-2xl text-center font-normal">
          {isRecording ? 'Te escucho...' : 'Cuéntame algo'}
        </h1>
        <button onClick={handleToggleRecording} disabled={loading}>
          <Ripple
            numCircles={isRecording ? 3 : 1}
            mainCircleSize={164}
            mainCircleOpacity={!isRecording ? 1 : 0.24}
            color={!isRecording ? 'bg-red-500' : 'bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec]'}
            className={isRecording ? 'animate-ripple' : ''}
          />
          <div className={cn(
            "absolute z-50 [&_svg]:size-16 [&_svg]:stroke-1 rounded-full flex items-center justify-center size-full p-8 transition-all duration-200",
            isRecording ? "animate-ripple" : "text-white top-0 left-0 -mt-12"
          )}>
            {isRecording ? <Mic /> : <MicOff />}
          </div>
        </button>
        <div className='flex flex-col gap-3 w-full'>
          {recordedAudio && !isRecording ? (
            <>
              <div className="flex gap-4 text-base font-medium items-center h-7">
                <div className="w-full h-px bg-neutral-200" />
                <p className="text-neutral-400 whitespace-nowrap font-normal">o también</p>
                <div className="w-full h-px bg-neutral-200" />
              </div>
              <TextAreaDrawer
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <Button
                onClick={handleSubmitAudio}
                variant="primary"
                className="w-full flex gap-1.5"
              >
                Continuar
                <ArrowRight />
              </Button>
              <div className="flex gap-4 text-base font-medium items-center h-7">
                <div className="w-full h-px bg-neutral-200" />
                <p className="text-neutral-400 whitespace-nowrap font-normal">o también</p>
                <div className="w-full h-px bg-neutral-200" />
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full text-base font-normal h-10 bg-neutral-200/40 !hover:bg-black"
              >
                Seguir grabando
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
