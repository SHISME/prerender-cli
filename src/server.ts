import express from 'express';
import { IServerConfig } from './types';

export default function startServer(config: IServerConfig): Promise<void> {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.static(config.staticDir));
    if (config.mockApiDir) {
      const mockApiMiddleware = require('express-mock-api-middleware')(
        config.mockApiDir,
      );
      app.use(mockApiMiddleware);
    }

    app.listen(config.port, () => {
      resolve();
    });
  });
}
