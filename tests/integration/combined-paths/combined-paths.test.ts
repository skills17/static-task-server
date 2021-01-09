import path from 'path';
import fetch from 'node-fetch';
import TaskConfig from '@skills17/task-config';
import Server from '../../../src/Server';

describe('combined paths', () => {
  let server: Server;

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it('serves folders under the root and sub path', async () => {
    const config = new TaskConfig();
    await config.loadFromFile(path.resolve(__dirname, 'config.json'));

    const printer = jest.fn();

    server = new Server(config);
    await server.serve(true, printer);

    expect(printer).toHaveBeenCalledTimes(1);
    expect(printer).toHaveBeenCalledWith('Task available at http://localhost:3000');

    const rootData = await (await fetch('http://localhost:3000/root.txt')).text();
    const subData = await (await fetch('http://localhost:3000/assets/test.txt')).text();

    expect(rootData.trim()).toEqual("I'm at the root");
    expect(subData.trim()).toEqual('hello world');
  });
});
