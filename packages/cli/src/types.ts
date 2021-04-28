/** @format */

import hooks from './hooks';

export interface IServerConfig {
  port?: number;
  staticDir: string;
}

export interface IRoute {
  path: string;
  outputPath: string;
  captureAfterElementExists?: string | string[];
  captureAfterDocumentEvent?: string;
  captureAfterTime?: number;
}

export interface ICompiler {
  hooks: typeof hooks;
}

export abstract class PreRenderCliPlugin<T> {
  protected config: T;

  public abstract apply(compiler: ICompiler): void;
}

export interface IPreRenderConfig {
  routes: IRoute[];
  server: IServerConfig;
  plugins?: PreRenderCliPlugin<any>[];
}

export enum PreRenderCliHook {
  beforeStartStaticServer = 'beforeStartStaticServer',
}
