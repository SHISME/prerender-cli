/** @format */

import { SyncHook } from 'tapable';
import { Express } from 'express';
import { PreRenderCliHook } from './types';

const hooks = {
  [PreRenderCliHook.beforeStartStaticServer]: new SyncHook<Express>(
    ['app'],
  ),
};

export default hooks;
