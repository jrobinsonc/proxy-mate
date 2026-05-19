import fs from 'node:fs';

describe('config.ts error paths', () => {
  let readFileSyncSpy: jest.SpyInstance;
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
  });

  afterEach(() => {
    readFileSyncSpy.mockRestore();
    process.env = originalEnv;
  });

  describe('configuration file parsing', () => {
    it('should throw TypeError on SyntaxError (invalid JSON)', async () => {
      readFileSyncSpy.mockReturnValue('invalid json');
      await expect(import('../src/config')).rejects.toThrow(TypeError);
      await expect(import('../src/config')).rejects.toThrow(
        'Failed to parse configuration file',
      );
    });

    it('should throw TypeError on z.ZodError (invalid schema)', async () => {
      readFileSyncSpy.mockReturnValue('{"tld": "invalid", "routes": {}}');
      await expect(import('../src/config')).rejects.toThrow(TypeError);
      await expect(import('../src/config')).rejects.toThrow(
        /^Invalid configuration:/,
      );
    });

    it('should throw Error on generic error during file read', async () => {
      readFileSyncSpy.mockImplementation(() => {
        throw new Error('File not found');
      });
      await expect(import('../src/config')).rejects.toThrow(Error);
      await expect(import('../src/config')).rejects.toThrow(
        'Unexpected error while processing configuration file: File not found',
      );
    });

    it('should throw Error on string thrown during file read', async () => {
      readFileSyncSpy.mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'String error';
      });
      await expect(import('../src/config')).rejects.toThrow(Error);
      await expect(import('../src/config')).rejects.toThrow(
        'Unexpected error while processing configuration file: String error',
      );
    });
  });

  describe('environment variables parsing', () => {
    it('should throw TypeError on z.ZodError (invalid schema)', async () => {
      readFileSyncSpy.mockReturnValue('{"tld": ".test", "routes": {}}');
      process.env.LOG_LEVEL = 'invalid';
      await expect(import('../src/config')).rejects.toThrow(TypeError);
      await expect(import('../src/config')).rejects.toThrow(
        /^Invalid environment variables:/,
      );
    });
  });
});
