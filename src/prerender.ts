import { IPreRenderConfig } from './types';
import startServer from './server';

function preRenderPage(): string {
  return '';
}

async function startBuildPreRenderPages(prenRenderConfig: IPreRenderConfig): Promise<void> {
  await startServer(prenRenderConfig.server);
}

function injectSkeleton(): string {
  return '';
}

export {
  startBuildPreRenderPages,
  preRenderPage,
  injectSkeleton,
};
