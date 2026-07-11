import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { createUserRequest } from '@/modules/user/api';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      toast.success('User created');
      void queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
