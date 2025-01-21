import { z } from 'zod';

/**
 * Parses a Zod validation error into an array of human-readable error messages
 *
 * @param error - The Zod error object to parse
 * @returns An array of strings where each string describes a validation error
 * in the format "path.to.field is error message"
 */
export function parseZodErrors(error: z.ZodError): string[] {
  return error.errors.map(
    (e: z.ZodIssue) => `${e.path.join('.')} is ${e.message.toLowerCase()}`,
  );
}
