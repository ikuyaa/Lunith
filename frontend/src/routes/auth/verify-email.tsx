import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { authClient } from '@/utils/auth-client'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const tokenSchema = z.object({
    token: z.string().optional()
})

export const Route = createFileRoute('/auth/verify-email')({
  component: RouteComponent,
  validateSearch: zodValidator(tokenSchema),
  beforeLoad: async ({ search }) => {
    if(!search?.token) {
        throw redirect({
            to: '/auth/register',
            replace: true,
        })
    }
  },
})

function RouteComponent() {
    const { token } = Route.useSearch()

    const { isLoading, data} = useQuery({
        queryKey: ['verify-email'],
        queryFn: async () => {
          const req = await authClient.verifyEmail({
            query: {
              token: token as string,
            }
          });
    
          return req;
        },
      })

  return (
    <div className='flex flex-col items-center justify-center h-screen pb-68'>
      <Card className='w-[360px]'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Verifying your email.</CardTitle>
        </CardHeader>
        <CardContent className='text-center'> 
          { isLoading ? (
              <Loader2 className='flex justify-center items-center text-center animate-spin' />
            ) : data?.data?.status === true ? (   
              <p className='text-green-500'>Email verified successfully!</p>
            ) : (
              <p className='text-red-500'>Email verification failed!</p>
            )
          }
        </CardContent>
      </Card>
    </div>
  )
}
