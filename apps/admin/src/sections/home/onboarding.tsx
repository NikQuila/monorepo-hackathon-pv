import { useState } from 'react';
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

export default function Onboarding() {
  const { userProfile, refreshUserProfile } = useUserStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!name.trim() || !age.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Por favor ingresa una edad válida');
      return;
    }

    setLoading(true);
    setError('');
    const res = await updateUserProfile(userProfile?.id as string, {
      name,
      age,
    });
    if (res) {
      refreshUserProfile();
      toast.success('Perfil actualizado');
    } else {
      setError('Hubo un error al actualizar tu perfil');
      toast.error('Hubo un error al actualizar tu perfil');
    }
    setLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Completa tu perfil</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Input
              placeholder='Tu nombre'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='text-lg'
            />
            <Input
              type='number'
              placeholder='Tu edad'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className='text-lg'
              min={1}
              max={120}
            />
          </div>

          {error && <p className='text-center text-sm text-red-500'>{error}</p>}

          <Button
            onClick={handleContinue}
            className='w-full bg-pink-600 hover:bg-pink-700'
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Continuar'}
          </Button>

          <p className='text-center text-sm text-slate-500'>
            Al apretar 'Continuar' estás aceptando los Términos y Condiciones
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
