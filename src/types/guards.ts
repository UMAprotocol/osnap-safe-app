export type ErrorWithMessage = Error & {
  message: string;
};

export type HttpError = ErrorWithMessage & {
  cause: number;
};

// predicate for better error handling
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return error !== null && typeof error === "object" && "message" in error;
}

// predicate for better error handling in API routes
export function isHttpError(error: unknown): error is HttpError {
  return isErrorWithMessage(error) && typeof error.cause === "number";
}
