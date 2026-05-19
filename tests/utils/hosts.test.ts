import hostile from 'hostile';
import { setHosts, removeHosts } from '../../src/utils/hosts';

jest.mock('hostile');

describe('Hosts Utility', () => {
  const routes: Record<string, string> = {
    app1: 'http://localhost:3000',
    app2: 'http://localhost:4000',
  };
  const tld: string = '.local';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setHosts', () => {
    it('should set hosts for all routes', () => {
      setHosts(routes, tld);

      expect(hostile.set).toHaveBeenCalledTimes(2);
      expect(hostile.set).toHaveBeenCalledWith('127.0.0.1', 'app1.local');
      expect(hostile.set).toHaveBeenCalledWith('127.0.0.1', 'app2.local');
    });
  });

  describe('removeHosts', () => {
    it('should remove hosts for all routes', () => {
      removeHosts(routes, tld);

      expect(hostile.remove).toHaveBeenCalledTimes(2);
      expect(hostile.remove).toHaveBeenCalledWith('127.0.0.1', 'app1.local');
      expect(hostile.remove).toHaveBeenCalledWith('127.0.0.1', 'app2.local');
    });
  });
});
