import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "../index.css"
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navbar from '@/components/navbar/navbar'
import { scan } from 'react-scan'
import { Toaster } from 'sonner'
import { TimeMS } from '@shared/lib/time.lib'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //Time data remains fresh
      staleTime: TimeMS.mins(5),
      //Time before garbage collection
      gcTime: TimeMS.mins(30),
      //Retry on fauilure
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    }
  }
})

export const Route = createRootRoute({
  component: Root,
})

export function Root() {
  scan({
    enabled: true,
  })

  return (
    <div className='font-jersey15'>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark'>
        <Navbar />
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
    </div>
  )
}