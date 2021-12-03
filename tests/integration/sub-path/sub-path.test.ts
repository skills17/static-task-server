import path from 'path';
import fetch from 'node-fetch';
import TaskConfig from '@skills17/task-config';
import Server from '../../../src/Server';

describe('sub path', () => {
  let server: Server;

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it('serves a folder under a sub path', async () => {
    const config = new TaskConfig();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    const printer = jest.fn();

    server = new Server(config);
    await server.serve(true, printer);

    expect(printer).toHaveBeenCalledTimes(1);
    expect(printer).toHaveBeenCalledWith('Task available at http://localhost:3000');

    const data = await (await fetch('http://localhost:3000/assets/test.txt')).text();

    expect(data.trim()).toEqual('hello world');
  });
});
