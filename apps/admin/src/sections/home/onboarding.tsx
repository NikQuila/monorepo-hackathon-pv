import { useState, useEffect } from 'react';
import { Button } from '@common/components/ui/button';
import { Input } from '@common/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import { updateUserProfile } from '@common/api/users';
import { toast } from 'react-toastify';
import useUserStore from '@/store/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'welcome' | 'name' | 'age' | 'ready';

const ageOptions = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55-64', label: '55-64' },
  { value: '65+', label: '65+' },
];

export default function Onboarding() {
  const { userProfile, refreshUserProfile } = useUserStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('welcome');

  useEffect(() => {
    if (currentStep === 'welcome') {
      const timer = setTimeout(() => {
        setCurrentStep('name');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleContinue = async () => {
    if (currentStep === 'name') {
      if (!name.trim()) {
        setError('Por favor ingresa tu nombre');
        return;
      }
      setError('');
      setCurrentStep('age');
      return;
    }

    if (currentStep === 'age') {
      if (!age) {
        setError('Por favor selecciona tu edad');
        return;
      }
      setError('');
      setCurrentStep('ready');
      return;
    }

    if (currentStep === 'ready') {
      setLoading(true);
      setError('');
      // Calculate average age from range
      let calculatedAge =
        age === '65+'
          ? '65+'
          : String(
              Math.floor(
                (Number(age.split('-')[0]) + Number(age.split('-')[1])) / 2
              )
            );
      const res = await updateUserProfile(userProfile?.id as string, {
        name,
        age: calculatedAge,
      });
      if (res) {
        refreshUserProfile();
        toast.success('¡Perfil actualizado!');
      } else {
        setError('Hubo un error al actualizar tu perfil');
        toast.error('Hubo un error al actualizar tu perfil');
      }
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            key='welcome'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='text-center text-lg'
          >
            Empecemos creando tu perfil
          </motion.div>
        );
      case 'name':
        return (
          <motion.div
            key='name'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Input
              placeholder='Tu nombre'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='text-lg'
              autoFocus
            />
          </motion.div>
        );
      case 'age':
        return (
          <motion.div
            key='age'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='space-y-2'
          >
            {ageOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => setAge(option.value)}
                variant={age === option.value ? 'default' : 'outline'}
                className='w-full justify-start text-left'
              >
                {option.label}
              </Button>
            ))}
          </motion.div>
        );
      case 'ready':
        return (
          <motion.div
            key='ready'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='text-center space-y-4'
          >
            <p>Empezaremos creando tu primera entrada al diario.</p>
            <p className='text-sm text-slate-500'>
              No te sobrepienses, cualquier cosa sirve.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {currentStep === 'welcome' && 'Hola, Soy Journie'}
                {currentStep === 'name' && '¿Cuál es tu nombre?'}
                {currentStep === 'age' && '¿Qué edad tienes?'}
                {currentStep === 'ready' && '¿Todo listo?'}
              </motion.div>
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <AnimatePresence mode='wait'>{renderStepContent()}</AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center text-sm text-red-500'
            >
              {error}
            </motion.p>
          )}

          {currentStep !== 'welcome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleContinue}
                className='w-full bg-pink-600 hover:bg-pink-700'
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Continuar'}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
