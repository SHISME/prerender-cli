/** @format */

import {
  PreRenderCliPlugin,
  ICompiler,
  PreRenderCliHook,
} from 'prerender-cli';
import mockApiMiddleware from 'express-mock-api-middleware';

interface IConfig {
  path: string;
  options?: any;
}

export default class PreRenderCliMockPlugin extends PreRenderCliPlugin<IConfig> {
  constructor(config: IConfig) {
    super();
    this.config = config;
  }

  apply(compiler: ICompiler): void {
    compiler.hooks[
      PreRenderCliHook.afterCapture
    ].tapAsync('', async page => {});
    compiler.hooks[
      PreRenderCliHook.beforeStartStaticServer
    ].tap('PreRenderCliMockPlugin', app => {
      app.use(
        '/',
        mockApiMiddleware(
          this.config.path,
          this.config.options,
        ),
      );
    });
  }
}
