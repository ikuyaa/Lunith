import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "../index.css"
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({

})

export const Route = createRootRoute({
  component: () => (
    <>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark'>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
    </>
  ),
})