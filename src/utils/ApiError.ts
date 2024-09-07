interface ErrorData<T> {
  message: string;
  success: boolean;
  status: number;
  error?: T;
}

export function createError<T>(
  message: string,
  status: number,
  success: boolean,
  error?: T
): Error {
  const errorData: ErrorData<T> = {
    message,
    success,
    status,
    error,
  };

  // Create a new Error object and attach the errorData to it
  const err = new Error(message);
  (err as any).data = errorData;
  (err as any).status = status;

  return err;
}
