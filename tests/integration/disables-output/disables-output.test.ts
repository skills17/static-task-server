import path from 'path';
import fetch from 'node-fetch';
import TaskConfig from '@skills17/task-config';
import Server from '../../../src/Server';

describe('disables output', () => {
  let server: Server;

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it('does not output anything', async () => {
    const config = new TaskConfig();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    const printer = jest.fn();

    server = new Server(config);
    await server.serve(false, printer);

    expect(printer).not.toHaveBeenCalled();

    const data = await (await fetch('http://localhost:3000/test.txt')).text();

    expect(data.trim()).toEqual('hello world');
  });
});
