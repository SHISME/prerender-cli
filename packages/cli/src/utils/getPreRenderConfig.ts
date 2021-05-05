/** @format */

import path from 'path';
import { IPreRenderConfig } from '../types';
import getProgramOpts from './getProgramOpts';
import colors from './colors';

export default function getPreRenderConfig(): IPreRenderConfig {
  const options = getProgramOpts();
  const configPath = path.resolve(
    process.cwd(),
    `./${options.config}`,
  );
  try {
    const config = require(configPath) as IPreRenderConfig;
    return {
      server: {
        port: 8888,
        ...config,
      },
      ...config,
    };
  } catch (e) {
    console.log(
      colors.error('require config error:'),
      colors.green('configPath:'),
      colors.gray(configPath),
    );
    throw e;
  }
}
