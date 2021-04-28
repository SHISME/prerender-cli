/** @format */

import express from 'express';
import { IServerConfig, PreRenderCliHook } from './types';
import hooks from './hooks';

export default function startServer(
  config: IServerConfig,
): Promise<void> {
  return new Promise(resolve => {
    const app = express();
    app.use(express.static(config.staticDir));
    hooks[PreRenderCliHook.beforeStartStaticServer].call(
      app,
    );
    app.listen(config.port, () => {
      resolve();
    });
  });
}
