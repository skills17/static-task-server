import path from 'path';
import http from 'http';
import express from 'express';
import TaskConfig from '@skills17/task-config';

export default class Server {
  private server?: http.Server;

  constructor(private config: TaskConfig) {}

  /**
   * Checks whether the server is bound to localhost only
   */
  private isLocalhost(): boolean {
    const serveConfig = this.config.getServe();

    return !serveConfig.bind || serveConfig.bind === '127.0.0.1' || serveConfig.bind === '0.0.0.0';
  }

  /**
   * Returns the host under which the server is available
   */
  public getHost(): string {
    const serveConfig = this.config.getServe();

    return `http://${this.isLocalhost() ? 'localhost' : serveConfig.bind}:${serveConfig.port}`;
  }

  /**
   * Starts serving static task files
   *
   * @param printOnReady Print to the console on which address the files are served
   * @param printer Printer function
   */
  public async serve(printOnReady = true, printer = console.log): Promise<void> {
    return new Promise((resolve) => {
      const serveConfig = this.config.getServe();

      if (!serveConfig.enabled) {
        resolve();
        return;
      }

      const app = express();

      // create mappings
      const mappings = serveConfig.mapping;
      const projectRoot = this.config.getProjectRoot();
      Object.keys(mappings).forEach((httpPath) => {
        const filePath = mappings[httpPath];
        app.use(httpPath, express.static(path.resolve(projectRoot, filePath)));
      });

      // handle listening callback
      const onListen = () => {
        if (printOnReady) {
          printer(`Task available at ${this.getHost()}`);
        }

        resolve();
      };

      // start listening
      if (serveConfig.bind) {
        this.server = app.listen(serveConfig.port, serveConfig.bind, onListen);
      } else {
        this.server = app.listen(serveConfig.port, onListen);
      }
    });
  }

  /**
   * Stops serving files
   */
  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
