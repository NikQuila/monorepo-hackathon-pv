import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@common/components/ui/dialog";
import { Button } from "@common/components/ui/button";
import { Input } from "@common/components/ui/input";
import { Label } from "@common/components/ui/label";
import { ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      icon: (
        <div className='bg-purple-100/40 mt-8 mb-3 flex text-5xl aspect-square rounded-full size-20 mx-auto items-center justify-center'>
          <img src='/isotipo.svg' alt='Yournal' className='h-10 w-auto' />
        </div>
      ),
      title: 'Qué es Yournal?',
      description: 'Yournal es tu diario, tu amigo, tu psicólogo. ',
      content: (
        <div className="text-neutral-600 flex flex-col gap-6">
          <p>
            Transformamos tus pensamientos en insights, descubriendo patrones en tus emociones.
          </p>
          <ul className="ml-4 flex flex-col gap-5 font-semibold marker:text-neutral-300 list-disc decoration-neutral-200">
            <li>✍️ Registra tu día a día</li>
            <li>🔍 Identifica tus hábitos</li>
            <li>💡 Recomendaciones según tus gustos</li>
            <li>📈 Mejoras en tu bienestar</li>
          </ul>
        </div>
      ),
    },
    {
      icon: (
        <div className='mt-8 mb-3 flex text-5xl aspect-square rounded-full size-20 mx-auto items-center justify-center bg-[#E2E8FF]'>
          ✍️
        </div>
      ),
      title: 'Cómo funciona?',
      description: 'En 3 pasos te lo explicamos.',
      content: (
        <ul className="ml-4 flex flex-col gap-5 marker:text-neutral-300 text-neutral-600 list-disc decoration-neutral-200">
          <li>1️⃣ <strong className="text-neutral-800">Escribes</strong> tus pensamientos y emociones a diario.</li>
          <li>2️⃣ <strong className="text-neutral-800">Descubres</strong> patrones y relaciones en tus emociones.</li>
          <li>3️⃣ <strong className="text-neutral-800">Mejoras</strong> tu bienestar con recomendaciones personalizadas.</li>
          <li className="list-none ">...y repites 🔁</li>
        </ul>
      ),
    },
    {
      icon: (
        <div className='mt-8 mb-3 flex text-5xl aspect-square rounded-full size-20 mx-auto items-center justify-center bg-[#fef7e2]'>
          💡
        </div>
      ),
      title: 'Consejos',
      description: 'Algunos consejos para sacar el máximo provecho de Yournal:',
      content: (
        <ul className="text-neutral-600 ml-4 flex flex-col gap-5 marker:text-neutral-300 list-disc decoration-neutral-200">
          <li>📝 Escribe todos los días, siempre que lo necesites, en cualquier lugar.</li>
          <li>💭 Sé honesto y detallado, te ayudará a identificar mejor tus emociones.</li>
          <li>⚙️ Revisa tus insights semanalmente para notar tu progreso.</li>
        </ul>
      ),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={() => setCurrentStep(0)} className="gap-1.5 px-0 text-neutral-800">
          <HelpCircle />
          Tips
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-svh">
        <DialogHeader>
          <DialogTitle>
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            <p className='text-base tracking-tight text-neutral-400 font-normal'>
              {steps[currentStep].description}
            </p>
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={prevStep}
          size='icon'
          variant='ghost'
          className={cn(
            "fixed [&_svg]:size-6 top-2 left-2 p-4 text-neutral-400",
            currentStep === 0 && "hidden"
          )}
        >
          <ArrowLeft />
        </Button>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {steps[currentStep].content}
        </motion.div>

        <DialogFooter className="flex flex-col gap-2">
          <div className="flex justify-center items-center py-4">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "size-2 rounded-full",
                    currentStep === index ? "bg-neutral-500" : "bg-neutral-200"
                  )}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
          {currentStep === totalSteps - 1 ? (
            <DialogClose asChild>
              <Button variant="primary" type="submit">Cerrar</Button>
            </DialogClose>
          ) : (
            <Button variant="primary" onClick={nextStep}>Next</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
