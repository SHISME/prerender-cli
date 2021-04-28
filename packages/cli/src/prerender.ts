/** @format */

import puppeteer, { Browser, Page } from 'puppeteer';
import { IPreRenderConfig, IRoute } from './types';
import {
  Semaphore,
  colors,
  getPreRenderConfig,
  delay,
} from './utils';

const semaphore = new Semaphore(3);
const preRenderConfig = getPreRenderConfig();

async function preRenderPage({
  browser,
  route,
}: {
  browser: Browser;
  route: IRoute;
}): Promise<string> {
  const page = await browser.newPage();
  const url = `http://localhost:${preRenderConfig.server.port}/${route.path}`;
  await page.goto(url);
  if (route.captureAfterElementExists) {
    if (
      typeof route.captureAfterElementExists === 'string'
    ) {
      await page.waitForSelector(
        route.captureAfterElementExists,
      );
    } else {
      await Promise.all(
        route.captureAfterElementExists.map(selector =>
          page.waitForSelector(selector),
        ),
      );
    }
  }

  if (route.captureAfterTime) {
    await delay(route.captureAfterTime);
  }
  return '';
}

async function startBuildPreRenderPages(): Promise<void> {
  const browser = await puppeteer.launch();
  await Promise.all(
    preRenderConfig.routes.map(async route => {
      await semaphore.acquire();
      try {
        await preRenderPage({
          browser,
          route,
        });
      } catch (e) {
        console.log(
          colors.error('preRenderPage error:'),
          colors.data(route.path),
          e,
        );
      } finally {
        semaphore.release();
      }
    }),
  );
}

export { startBuildPreRenderPages, preRenderPage };
