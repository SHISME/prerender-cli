/** @format */

import hooks from './hooks';

export interface IServerConfig {
  /**
   * @default 8888
   */
  port?: number;
  staticDir: string;
}

export interface IRoute {
  path: string;
  outputPath?: string;
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
  cdnMappings?:{
    regExp: RegExp;
    targetPath: string;
  }[];
  server: IServerConfig;
  injectConfig?: {
    propertyName: string;
    value:any;
  };
  // https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  deviceName?: string;
  plugins?: PreRenderCliPlugin<any>[];
}

export enum PreRenderCliHook {
  beforeStartStaticServer = 'beforeStartStaticServer',
  beforeLoadPage = 'beforeLoadPage',
  afterCapture = 'afterCapture',
}
