import { SparklesCore } from "../ui/sparkles";

interface HeroSparklesTextProps {
  text: string; 
}

export function HeroSparklesText({text}: HeroSparklesTextProps) {
  return (
    <div className="w-full flex flex-col bg-transparent items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-6xl text-5xl lg:text-8xl font-bold text-center dark:text-white text-primary relative z-20">
        {text}
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[var(--hero-gradient-1)] to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[var(--hero-gradient-2)] h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[var(--hero-gradient-3)] to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[var(--hero-gradient-4)] to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
