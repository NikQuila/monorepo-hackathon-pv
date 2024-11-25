import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
  'Preparando tu diario ✍️',
  'Configurando tus pensamientos 🧠',
  'Afinando detalles 📖',
  'Organizando tus ideas 💡',
  'Casi listos 🚀',
];

const RotatingMessage = ({
  messages = loadingMessages,
  interval = 2000,
}: {
  messages?: string[];
  interval?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages, interval]);

  return (
    <div className="relative flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute text-nowrap mx-auto"
        >
          {messages[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingMessage;
