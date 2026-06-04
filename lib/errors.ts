export type FieldErrors = Record<string, string>;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function isUnauthorizedStatus(status?: number): boolean {
  return status === 401;
}

export function isForbiddenStatus(status?: number): boolean {
  return status === 403;
}

export function isNotFoundStatus(status?: number): boolean {
  return status === 404;
}
