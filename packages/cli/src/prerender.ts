/** @format */

import puppeteer, { Browser, Page } from 'puppeteer';
import {
  IPreRenderConfig,
  IRoute,
  PreRenderCliHook,
} from './types';
import {
  Semaphore,
  colors,
  getPreRenderConfig,
  delay,
} from './utils';
import hooks from './hooks';

const semaphore = new Semaphore(3);
const preRenderConfig = getPreRenderConfig();
const staticServerHost = `http://localhost:${preRenderConfig.server.port}`;

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

async function injectProperty(page: Page): Promise<void> {
  if (preRenderConfig.injectConfig) {
    await page.evaluateOnNewDocument(injectConfig => {
      const { propertyName, value } = injectConfig;
      // @ts-ignore
      window[propertyName] = value;
    }, preRenderConfig.injectConfig);
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
  const url = `${staticServerHost}/${route.path}`;
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (!preRenderConfig.cdnMappings) {
      req.continue();
      return;
    }
    const cdnMap = preRenderConfig.cdnMappings.find(
      ({ regExp }) => regExp.test(url),
    );
    if (cdnMap) {
      req.continue();
      return;
    }
    const newUrl = url.replace(
      cdnMap.regExp,
      `${staticServerHost}/${cdnMap.targetPath}`,
    );
    req.continue({ url: newUrl });
  });
  await injectProperty(page);
  await page.goto(url);
  await captureAfter(page, route);
  await hooks[PreRenderCliHook.afterCapture].promise(page);
  return '';
}

async function startBuildPreRenderPages(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: false,
  });
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
