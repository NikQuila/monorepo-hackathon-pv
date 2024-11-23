import { useState } from 'react';
import {
  registerWithEmailAndPassword,
  createUserProfile,
} from 'common/src/api/auth';

type Props = {
  setView: (view: 'login' | 'register') => void;
};

export default function Register({ setView }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    try {
      const user = await registerWithEmailAndPassword(email, password);
      if (user) {
        await createUserProfile({ ...user });
      }
    } catch (error) {
      setError('Error al registrar usuario');
    }
    setLoading(false);
  };

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
      <div className='w-full max-w-[400px] space-y-8 rounded-lg bg-white p-8 shadow-sm'>
        {/* Logo */}
        <div className='flex flex-col items-center gap-2'>
          <div className='h-12 w-12 rounded-lg bg-gray-200'></div>
          <h2 className='text-2xl font-semibold'>Registrate en Journie</h2>
        </div>

        {/* Form */}
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none'
              placeholder='m@journie.com'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Contraseña
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none'
              placeholder='********'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Confirmar Contraseña
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none'
              placeholder='********'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <button
            onClick={handleRegister}
            disabled={loading}
            className='w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-3 text-white transition hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>

        <p className='text-center text-sm text-gray-600'>
          Ya tienes una cuenta?{' '}
          <button
            onClick={() => setView('login')}
            className='font-medium text-blue-600 hover:underline'
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
