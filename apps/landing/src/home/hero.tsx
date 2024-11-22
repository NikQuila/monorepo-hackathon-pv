import { Button } from "@common/components/ui/button";
import GridPattern from "@common/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import Particles from "@common/components/ui/particles";

export default function Hero() {
  return (
    <div className="overflow-clip flex flex-col pt-44 px-4 gap-24 justify-between items-center relative text-center min-h-svh text-white bg-neutral-950">
      <div className="z-10 flex flex-col items-center gap-8 max-w-4xl">
        <div className="flex flex-col gap-12 max-w-4xl">
          <span className="text-sm md:text-base text-slate-200">
            Simple. Fast. Hyper-Targeted ads
          </span>
          <h1 className="-mt-6 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            La nueva forma de enseñar a tus alumnos.
          </h1>
          <p className="text-slate-200 text-sm md:text-lg max-w-2xl mx-auto">
            Engage high-potential travelers directly through in-room tablets. Perfect for brands looking to connect with a premium, international, and highly receptive audience, whether on vacation or business.
          </p>
        </div>
        <Button size="lg" className="bg-neutral-600 px-4" asChild>
          <a href="#">
            Book a demo
          </a>
        </Button>
      </div>
      <div className="z-10 relative mt-[8rem] animate-fade-up [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,#000,transparent)]">
        <div className="rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,#ffbd7a,#ffbd7a,transparent_40%)]">
          <img
            src="https://startup-template-sage.vercel.app/hero-dark.png"
            width="1280"
            height="512"
            className="relative w-full h-full rounded-[inherit] object-contain"
            alt="A tablet with the UI"
          />
        </div>
      </div>
      {/* <GridPattern
        width={64}
        height={64}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_top,white,transparent,transparent)]",
          "opacity-30"
        )}
      /> */}
      <Particles
        className={cn(
          "absolute inset-0",
        )}
        quantity={120}
        ease={80}
        color="#ffffff"
        refresh
      />
    </div>
  )
}
