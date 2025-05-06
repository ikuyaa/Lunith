import FormInputControl from '../form/form-input'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormValues } from '@shared/schemas/auth.schemas'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/utils/auth-client'
import { toast } from 'sonner'
import { REQUIRE_EMAIL_VERIFICATION } from '@shared/config/auth.config'
import { TimeMS } from '@shared/lib/time.lib'
import FormDatePicker from './form-date-picker'

const RegisterForm = () => {
    const navigate = useNavigate();
    const router = useRouter();
  
    const form = useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),  
      defaultValues: {
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
      },
    })
  
    const {mutate} = useMutation({
      mutationKey: ['auth-user-register'],
      mutationFn: async (data: RegisterFormValues) => {
          await registerUser(data)
      },
      onSuccess: () => {
          toast.dismiss();
          if(REQUIRE_EMAIL_VERIFICATION) {
              toast.success('Account created! Please check your email for a verification link.');
          } else {
              toast.success('Account created! You can now login.');
          }
          setTimeout(() => {
            toast.dismiss();
            router.invalidate();
            navigate({
              to: '/auth/login',
              search: {
                email: form.getValues('email'),
              },
            });
          }, 
          TimeMS.secs(3))
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
  
    function onSubmit(values: RegisterFormValues) {
      console.log('registering')
      mutate(values)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-4'>
      {/* First and Last Name */}
      <div className={`grid grid-cols-1 md:grid-cols-2 text-center md:space-y-0 space-y-4`}>
        <FormInputControl 
          form={form}
          name='firstName'
          placeholder='Richard'
          label='First Name'
        />
        <FormInputControl 
          form={form}
          name='lastName'
          placeholder='James'
          label='Last Name'
        />
        </div>
        {/* Email and Username */}  
        <div className={`grid grid-cols-1 md:grid-cols-2 text-center md:space-y-0 space-y-4`}>    
          <FormInputControl 
            form={form}
            name='username'
            placeholder='gamerman47'
            label='Username'
          />
          <FormInputControl 
            form={form}
            name='email'
            placeholder='your@email.com'
            label='Email'
            inputType='email'
            />
        </div>
        {/* Password and Confirm Password */}
        <div className={`grid grid-cols-1 md:grid-cols-2 text-center md:space-y-0 space-y-4`}>
          <FormInputControl 
            form={form}
            name='password'
            placeholder='********'
            label='Password'
            inputType='password'
            />
          <FormInputControl 
            form={form}
            name='confirmPassword'
            placeholder='********'
            label='Confirm Password'
            inputType='password'
          />
            </div>
            <div className='flex flex-col items-center justify-center pt-4 space-y-2'> 
            <span className='text-xl underline underline-offset-2'>Date of Birth</span>
            <FormDatePicker 
              form={form}
            />
            </div>
          <Button 
            className='w-[180px] text-xl hover:scale-105 transition-all duration-200 mt-4 cursor-pointer active:scale-95' 
            type='submit'
          >
            Register
          </Button>
        </form>
    </Form>
  )
}

export default RegisterForm