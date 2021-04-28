/** @format */

import path from 'path';
import { getPreRenderConfig, colors } from './utils';
import { startBuildPreRenderPages } from './prerender';
import startServer from './server';
import hooks from './hooks';

async function run(): Promise<void> {
  const config = getPreRenderConfig();
  if (config.plugins) {
    config.plugins.forEach(plugin => {
      plugin.apply({ hooks });
    });
  }
  await startServer(config.server);
  await startBuildPreRenderPages();
}

run()
  .then(() => {
    console.log(colors.succeed('preRender over'));
  })
  .catch(e => {
    throw e;
  });
