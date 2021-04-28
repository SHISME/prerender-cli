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

async function captureAfter(
  page: Page,
  route: IRoute,
): Promise<void> {
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

  if (route.captureAfterDocumentEvent) {
    await page.evaluate(captureAfterDocumentEvent => {
      return new Promise(resolve => {
        // @ts-ignore
        document.addEventListener(
          captureAfterDocumentEvent,
          () => {
            resolve(undefined);
          },
        );
      });
    }, route.captureAfterDocumentEvent);
  }

  if (route.captureAfterTime) {
    await delay(route.captureAfterTime);
  }
}

async function preRenderPage({
  browser,
  route,
}: {
  browser: Browser;
  route: IRoute;
}): Promise<string> {
  const page = await browser.newPage();
  const url = `http://localhost:${preRenderConfig.server.port}/${route.path}`;
  await page.setRequestInterception(true);
  page.on('request', () => {});
  await page.goto(url);
  await captureAfter(page, route);

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
