import { ISkeletonConfig } from './types';
import startServer from './server';

function preRenderPage(): string {
  return '';
}

async function startBuildSkeleton(skeletonConfig: ISkeletonConfig): Promise<void> {
  await startServer(skeletonConfig.server);
}

function injectSkeleton(): string {
  return '';
}

export {
  startBuildSkeleton,
  preRenderPage,
  injectSkeleton,
};
