# skills17/static-task-server

Serves static task files.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```bash
npm install @skills17/static-task-server
```

## Usage

A `TaskConfig` instance of the [`@skills17/task-config`](https://github.com/skills17/task-config) package can be passed to the `Server` constructor.

```typescript
import Server from '@skills17/static-task-server';

const server = new Server(taskConfig);
await server.serve();
```

This will start a static file server on the address and port specified in the task configuration.
The address under which the task is reachable will be printed to the console.
To disable the console output, pass `false` as a parameter to the `serve` method.

Later, the server can be stopped again by calling the `stop` method:

```typescript
await server.stop();
```

## License

[MIT](https://github.com/skills17/static-task-server/blob/master/LICENSE)
