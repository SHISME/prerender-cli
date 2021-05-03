/** @format */

import { Command } from 'commander';

interface IOptions {
  config: string;
}

const program = new Command();
program.option('-c, --config <configName>', 'PreRender config');
program.parse(process.argv);
const options = program.opts();

const defaultOptions = {
  config: 'prerender.config.js',
};

export default function getProgramOpts(): IOptions {
  return {
    ...defaultOptions,
    ...options,
  };
}
