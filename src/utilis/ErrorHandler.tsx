import { toast } from 'react-toastify';
import axios from 'axios';
type ApiValidationError = {
  msg: string;
  param?: string;
  location?: string;
};
export const handleApiError = (
  err: unknown,
  fallbackMessage = 'Something went wrong. Please try again later.',
) => {
  if (axios.isAxiosError(err)) {
    const backendErrors = err.response?.data.errors as ApiValidationError[];
    if (backendErrors?.length) {
      backendErrors.forEach((e) => toast.error(e.msg));
    } else {
      toast.error(err.response?.data?.error?.message || fallbackMessage);
    }
  } else {
    toast.error(fallbackMessage);
  }
};
