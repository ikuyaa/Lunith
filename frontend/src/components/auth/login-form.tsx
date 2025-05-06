import { Form } from '../ui/form'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues} from '@shared/schemas/auth.schemas'
import { useMutation } from '@tanstack/react-query'
import { loginUserEmail} from '@/utils/auth-client'
import { toast } from 'sonner'
import FormInputControl from '../form/form-input'
import { Button } from '../ui/button'

const LoginForm = () => {
    const navigate = useNavigate();
    const router = useRouter();
  
    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),  
      defaultValues: {
          email: '',
          password: '',
      }
    })
  
    const {mutate} = useMutation({
      mutationKey: ['auth-user-register'],
      mutationFn: async (data: LoginFormValues) => {
          await loginUserEmail(data)
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success('Login success');
        router.invalidate();
        navigate({
          to: '/',
        });
      },
      onError: (err) => {
          toast.dismiss();
          toast.error(`Error: ${err.message}`);
      },
      onMutate: () => {
        toast.dismiss();
        toast.loading('Attemping to create account...');
      }
    })
  
    function handleSubmit(values: LoginFormValues) {
      mutate(values)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
        <div className='space-y-8'>
            <FormInputControl 
                name='email'
                label='Email'
                inputType='email'
                placeholder='your@email.com'
                form={form}
            />
            <FormInputControl 
                name='password'
                label='Password'
                inputType='password'
                placeholder='********'
                form={form}
            />

            <Button className='w-[135px] text-xl hover:scale-105 transition-all duration-300' type='submit'>    
                Login
            </Button>
        </div>

      </form>
    </Form>
  )
}

export default LoginForm