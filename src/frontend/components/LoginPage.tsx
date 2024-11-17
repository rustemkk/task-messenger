import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import React, { useContext } from 'react';
import { TextField, Input } from 'react-aria-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { AuthContext } from '../utils/contexts';
import { useMeMutation } from '../utils/hooks';

interface FormValues {
  username: string;
}

const schema = z.object({
  username: z.string().min(1).max(30),
});

const LoginPage = () => {
  const router = useRouter();
  const { setMe } = useContext(AuthContext);
  const meMutation = useMeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: { username: string }) => {
    const { username } = data;
    const account = await meMutation.mutateAsync(username);
    setMe(account);
    setTimeout(() => router.navigate({ to: '/' }), 50);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '60px 0',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex' }}>
          <TextField>
            <Input aria-label="Login input" {...register('username')} placeholder="Username" />
          </TextField>
          <button aria-label="Login" type="submit" style={{ marginLeft: '12px' }}>
            Login
          </button>
        </div>
        {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>}
      </form>
    </div>
  );
};

export default LoginPage;
