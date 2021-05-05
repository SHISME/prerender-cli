/** @format */

import { SyncHook, AsyncSeriesHook } from 'tapable';
import { Express } from 'express';
import { Page } from 'puppeteer';
import { PreRenderCliHook } from './types';

const hooks = {
  [PreRenderCliHook.beforeStartStaticServer]: new SyncHook<Express>(
    ['app'],
  ),
  [PreRenderCliHook.beforeLoadPage]: new AsyncSeriesHook<
    Page,
    void
  >(['page']),
  [PreRenderCliHook.afterCapture]: new AsyncSeriesHook<
    Page,
    void
  >(['page']),
};

export default hooks;
