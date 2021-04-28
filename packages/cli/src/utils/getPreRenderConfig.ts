import path from 'path';
import { IPreRenderConfig } from '../types';
import getOptions from './getOptions';

export default function getPreRenderConfig(): IPreRenderConfig {
  const options = getOptions();
  const configPath = path.resolve(
    process.cwd(),
    `./${options.config}`,
  );
  const config = require(configPath) as IPreRenderConfig;
  return {
    server: {
      port: 8888,
      ...config,
    },
    ...config,
  };
}
