/** @format */

import { Command } from 'commander';

interface IOptions {
  config: string;
}

const program = new Command();
program.option('-c, --config', 'PreRender config');
program.parse(process.argv);
const options = program.opts();

export default function getOptions(): IOptions {
  return {
    config: options.config || 'prerender.config.js',
    ...options,
  };
}
