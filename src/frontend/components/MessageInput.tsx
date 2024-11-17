import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { TextField, Input } from 'react-aria-components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

interface FormValues {
  content: string;
}

const schema = z.object({
  content: z.string().min(1),
});

const MessageInput = ({ disabled, onSend }: { disabled: boolean; onSend: (content: string) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data: { content: string }) => {
    const { content } = data;
    onSend(content);
    reset();
  };

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        padding: '24px',
        borderTop: '1px solid black',
        backgroundColor: '#fff',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', width: '100%' }}>
        <TextField name="content" type="text" isRequired style={{ width: '100%' }}>
          <Input
            aria-label="Message input"
            placeholder="Enter your message..."
            style={{ width: '100%' }}
            {...register('content')}
          />
          {errors?.content && <span style={{ color: 'red', fontSize: '12px' }}>{errors.content.message}</span>}
        </TextField>
        <button disabled={disabled} style={{ marginLeft: '12px' }} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
