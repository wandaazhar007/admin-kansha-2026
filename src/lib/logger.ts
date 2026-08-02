// src/lib/logger.ts
// Logs to the console only in dev builds; no-op in production so error
// details (stack traces, API payloads) never reach a shipped bundle's console.

export function logError(message: string, error?: unknown) {
  if (import.meta.env.DEV) {
    console.error(message, error);
  }
}
