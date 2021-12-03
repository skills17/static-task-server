import path from 'path';
import { promises as fs } from 'fs';
import ip from 'ip';
import fetch from 'node-fetch';
import TaskConfig from '@skills17/task-config';
import Server from '../../../src/Server';

describe('binds on other ip', () => {
  const ipAddress = ip.address();
  let server: Server;

  beforeEach(async () => {
    const content = await fs.readFile(path.resolve(__dirname, 'config.template.yaml'));
    await fs.writeFile(
      path.resolve(__dirname, 'config.yaml'),
      content.toString().replace(/\{BIND\}/g, ipAddress),
    );
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }

    await fs.unlink(path.resolve(__dirname, 'config.yaml'));
  });

  it('is only reachable from the defined ip', async () => {
    const config = new TaskConfig();
    await config.loadFromFile(path.resolve(__dirname, 'config.yaml'));

    const printer = jest.fn();

    server = new Server(config);
    await server.serve(true, printer);

    expect(printer).toHaveBeenCalledTimes(1);
    expect(printer).toHaveBeenCalledWith(`Task available at http://${ipAddress}:3000`);
    expect(server.getHost()).toEqual(`http://${ipAddress}:3000`);

    const ipData = await (await fetch(`http://${ipAddress}:3000/test.txt`)).text();

    expect(ipData.trim()).toEqual('hello world');
    expect(ipAddress).not.toEqual('127.0.0.1');
    await expect(async () => fetch('http://localhost:3000/test.txt')).rejects.toThrowError(
      'ECONNREFUSED',
    );
    await expect(async () => fetch('http://127.0.0.1:3000/test.txt')).rejects.toThrowError(
      'ECONNREFUSED',
    );
  });
});
