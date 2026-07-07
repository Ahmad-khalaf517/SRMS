import axios from 'axios';

type ApiErrorEnvelope = {
  message?: string;
  errors?: Array<{ message?: string }>;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorEnvelope>(error)) {
    return (
      error.response?.data?.errors?.[0]?.message ??
      error.response?.data?.message ??
      error.message ??
      'Something went wrong'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};
