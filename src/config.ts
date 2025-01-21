import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';
import { parseZodErrors } from './utils/zod';

/**
 * Absolute path to the root directory.
 */
const rootDir: string = path.resolve(fileURLToPath(import.meta.url), '..');

// eslint-disable-next-line @typescript-eslint/typedef
const configSchema = z.object({
  /**
   * Top-level domain.
   */
  tld: z.string().regex(/^\.[a-z]+/),
  /**
   * Routes.
   */
  routes: z.record(z.string(), z.string().url()),
});
let config: z.infer<typeof configSchema>;

try {
  const configStr: string = fs.readFileSync(
    path.resolve(rootDir, '..', 'config.json'),
    'utf8',
  );
  const configObj: unknown = JSON.parse(configStr);

  config = configSchema.parse(configObj);
} catch (error: unknown) {
  if (error instanceof SyntaxError) {
    throw new TypeError('Failed to parse configuration file');
  } else if (error instanceof z.ZodError) {
    throw new TypeError(
      `Invalid configuration: ${parseZodErrors(error).join(', ')}.`,
    );
  }

  throw new Error(
    `Unexpected error while processing configuration file: ${error instanceof Error ? error.message : String(error)}`,
  );
}

const enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

// eslint-disable-next-line @typescript-eslint/typedef
const envSchema = z.object({
  LOG_LEVEL: z
    .enum([LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error])
    .default(LogLevel.Info),
  NODE_ENV: z
    .enum([NodeEnv.Development, NodeEnv.Production, NodeEnv.Test])
    .default(NodeEnv.Production),
  PORT: z
    .string()
    .transform((val: string) => Number.parseInt(val, 10))
    .default('2000'),
});
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse({
    LOG_LEVEL: process.env.LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  });
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    throw new TypeError(
      `Invalid environment variables: ${parseZodErrors(error).join(', ')}.`,
    );
  }

  throw new Error(
    `Unexpected error while processing environment variables: ${error instanceof Error ? error.message : String(error)}`,
  );
}

export { config, env, LogLevel, NodeEnv };
