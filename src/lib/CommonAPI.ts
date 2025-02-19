import { useMutation } from '@tanstack/react-query';
import { api } from './api';
import { ContactFormInputs } from '@/components/AppContactForm';
import Response from '@/types/Response';
import { toast } from '@/components/ui/use-toast';

const sendEmail = async (inputs: ContactFormInputs): Promise<Response> => {
  const { data } = await api.post<Response>('/api/send-email', inputs);

  return data;
};

export const useSendEmail = () =>
  useMutation({
    mutationFn: async ({ inputs }: { inputs: ContactFormInputs }) => {
      return await sendEmail(inputs);
    },
    onSuccess: (response) => {
      if (response.success)
        toast({
          variant: 'success',
          description: response.message,
        });
    },
  });
