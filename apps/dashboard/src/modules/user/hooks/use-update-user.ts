import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { updateUserRequest } from '@/modules/user/api';
import type { UpdateUserDTO } from '@srms/api-contracts';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDTO }) =>
      updateUserRequest(id, payload),
    onSuccess: () => {
      toast.success('User updated');
      void queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
