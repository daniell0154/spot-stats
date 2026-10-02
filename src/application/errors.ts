export type AppErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_FAILED'
  | 'RATE_LIMITED'
  | 'FORBIDDEN'
  | 'PROVIDER_ERROR'
  | 'CONFIGURATION_ERROR';

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function friendlyError(error: unknown): string {
  if (!(error instanceof AppError)) return 'Não foi possível carregar seus dados agora.';
  if (error.code === 'RATE_LIMITED') {
    return `O Spotify pediu uma pausa${error.retryAfterSeconds ? ` de ${error.retryAfterSeconds}s` : ''}. Tente novamente em instantes.`;
  }
  if (error.code === 'AUTH_REQUIRED' || error.code === 'AUTH_FAILED') {
    return 'Sua conexão expirou ou não foi concluída. Conecte o Spotify novamente.';
  }
  if (error.code === 'FORBIDDEN') return 'Sua conta não liberou os dados necessários.';
  if (error.code === 'CONFIGURATION_ERROR') return 'O Spot Stats ainda precisa ser configurado.';
  return 'O Spotify não respondeu como esperado. Tente novamente.';
}
