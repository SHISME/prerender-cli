export interface IServerConfig {
  port: number;
  staticDir: string;
  mockApiDir?: string;
}

interface IRoute {
  path: string;
  captureAfterElementExists?: string | string[];
  captureAfterDocumentEvent?: string;
  captureAfterTime?: number;
}

export interface ISkeletonConfig {
  routes: IRoute[];
  server: IServerConfig;
}
