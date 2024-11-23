import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const sendMessageOrAudio = async (data: any) => {
  try {
    // Ya no necesitamos FormData porque ahora enviamos la URL directamente
    const response = await axios.post(`${API_URL}/chat`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};