import { ZodError } from 'zod';
import { parseZodErrors } from '../../src/utils/zod';

describe('Zod Utility', () => {
  describe('parseZodErrors', () => {
    it('should return an empty array when there are no issues', () => {
      const error = new ZodError([]);
      expect(parseZodErrors(error)).toEqual([]);
    });

    it('should return formatted strings for a single issue', () => {
      const error = new ZodError([
        {
          code: 'custom',
          path: ['user', 'name'],
          message: 'Expected string, received number',
        },
      ]);
      expect(parseZodErrors(error)).toEqual([
        'user.name is expected string, received number',
      ]);
    });

    it('should return formatted strings for multiple issues', () => {
      const error = new ZodError([
        {
          code: 'custom',
          path: ['user', 'name'],
          message: 'Expected string, received number',
        },
        {
          code: 'custom',
          path: ['user', 'age'],
          message: 'Number must be greater than or equal to 18',
        },
      ]);
      expect(parseZodErrors(error)).toEqual([
        'user.name is expected string, received number',
        'user.age is number must be greater than or equal to 18',
      ]);
    });

    it('should handle issues with an empty path', () => {
      const error = new ZodError([
        {
          code: 'custom',
          path: [],
          message: 'Invalid input',
        },
      ]);
      expect(parseZodErrors(error)).toEqual([' is invalid input']);
    });
  });
});
