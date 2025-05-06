import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/auth/register-form';
import { validateSession } from '@/utils/auth-client';

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { user, session  } = await validateSession()
    if(user || session) {
      throw redirect({
        to: '/',
        replace: true
      })
    }
  }
})

function RouteComponent() {
  return (
    <div
      className='flex justify-center min-h-[calc(100vh-96px)] pt-48 items-center sm:items-start overflow-y-auto'
    >
      <Card className='w-[450px] md:w-[550px] text-center'>
        <CardContent>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {`Register a new ${import.meta.env.VITE_APP_NAME} account`} 
            </CardTitle>
          </CardHeader>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
