import path from 'path';
import ip from 'ip';
import fetch from 'node-fetch';
import TaskConfig from '@skills17/task-config';
import Server from '../../../src/Server';

describe('binds on other port', () => {
  const ipAddress = ip.address();
  let server: Server;

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it('serves the files on a different port', async () => {
    const config = new TaskConfig();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    const printer = jest.fn();

    server = new Server(config);
    await server.serve(true, printer);

    expect(printer).toHaveBeenCalledTimes(1);
    expect(printer).toHaveBeenCalledWith('Task available at http://localhost:4000');
    expect(server.getHost()).toEqual('http://localhost:4000');

    const localhostData = await (await fetch('http://localhost:4000/test.txt')).text();

    expect(localhostData.trim()).toEqual('hello world');
    expect(ipAddress).not.toEqual('127.0.0.1');
    await expect(async () => fetch(`http://${ipAddress}:4000/test.txt`)).rejects.toThrowError(
      'ECONNREFUSED',
    );
  });
});
