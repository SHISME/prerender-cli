import hooks from './hooks';

export interface IServerConfig {
  port: number;
  staticDir: string;
}

interface IRoute {
  path: string;
  captureAfterElementExists?: string | string[];
  captureAfterDocumentEvent?: string;
  captureAfterTime?: number;
}

export interface IPreRenderConfig {
  routes: IRoute[];
  server: IServerConfig;
}

export enum PreRenderCliHook {
  beforeStartStaticServer = 'beforeStartStaticServer',
}

export interface ICompiler {
  hooks: typeof hooks;
}

export abstract class PreRenderCliPlugin<T> {
  protected config:T;

  public abstract apply(compiler: ICompiler):void;
}
