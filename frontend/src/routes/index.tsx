import { createFileRoute } from '@tanstack/react-router'
import { HeroSparklesText } from '../components/hero/hero-sparkle-text';
import Logo from '@/assets/logos/logo-transparent.png';


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-2 flex flex-col gap-0 items-center font-wizzta pb-48">
        <HeroSparklesText text={`${import.meta.env.VITE_APP_NAME}`}/>
      </div>
    </div>
    </>
  )
}