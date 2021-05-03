/** @format */

import {
  createProxyMiddleware,
  Filter,
  Options,
} from 'http-proxy-middleware';
import {
  ICompiler,
  PreRenderCliHook,
  PreRenderCliPlugin,
} from 'prerender-cli';

interface IConfig {
  path: string;
  filter?: Filter;
  options: Options;
}

export default class PreRenderCliHttpProxyPlugin extends PreRenderCliPlugin<
  IConfig[]
> {
  constructor(config: IConfig[]) {
    super();
    this.config = config;
  }

  apply(compiler: ICompiler): void {
    compiler.hooks[
      PreRenderCliHook.beforeStartStaticServer
    ].tap('PreRenderCliHttpProxyPlugin', app => {
      this.config.forEach(({ path, filter, options }) => {
        if (filter) {
          app.use(
            path,
            createProxyMiddleware(filter, options) as any,
          );
        } else {
          app.use(
            path,
            createProxyMiddleware(options) as any,
          );
        }
      });
    });
  }
}
