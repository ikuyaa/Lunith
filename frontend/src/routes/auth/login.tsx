import LoginForm from '@/components/auth/login-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex justify-center items-center min-h-screen pb-68'>
        <Card className='w-[450px] md:w-[550px] text-center'>
          <CardContent>
            <CardHeader>
              <CardTitle className='text-2xl'>
                {`Log into your ${import.meta.env.VITE_APP_NAME} account`} 
              </CardTitle>
            </CardHeader>
              <LoginForm />
          </CardContent>
        </Card>
    </div>
  )
}
