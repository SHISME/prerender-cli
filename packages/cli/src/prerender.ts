/** @format */

import puppeteer, {
  Browser,
  Page,
  devicesMap,
} from 'puppeteer';
import path from 'path';
import { IRoute, PreRenderCliHook } from './types';
import {
  Semaphore,
  colors,
  getPreRenderConfig,
  delay,
  savePreRenderHTML,
} from './utils';
import hooks from './hooks';

const semaphore = new Semaphore(3);
const preRenderConfig = getPreRenderConfig();
const staticServerHost = `localhost:${preRenderConfig.server.port}`;
const staticServerOrigin = `http://${staticServerHost}`;

async function captureAfter(
  page: Page,
  route: IRoute,
): Promise<void> {
  const promises = [];
  if (route.captureAfterElementExists) {
    if (
      typeof route.captureAfterElementExists === 'string'
    ) {
      promises.push(
        page.waitForSelector(
          route.captureAfterElementExists,
        ),
      );
    } else {
      promises.push(
        ...route.captureAfterElementExists.map(selector =>
          page.waitForSelector(selector),
        ),
      );
    }
  }

  if (route.captureAfterDocumentEvent) {
    promises.push(
      page.evaluate(captureAfterDocumentEvent => {
        return new Promise(resolve => {
          // @ts-ignore
          document.addEventListener(
            captureAfterDocumentEvent,
            () => {
              resolve(undefined);
            },
          );
        });
      }, route.captureAfterDocumentEvent),
    );
  }

  if (route.captureAfterTime) {
    promises.push(delay(route.captureAfterTime));
  }
  await Promise.all(promises);
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

async function emulate(page: Page): Promise<void> {
  const { deviceName } = preRenderConfig;
  if (deviceName && devicesMap[deviceName]) {
    await page.emulate(devicesMap[deviceName]);
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
  await emulate(page);
  const url = `${staticServerOrigin}${route.path}`;
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (!preRenderConfig.cdnMaps) {
      req.continue();
      return;
    }
    const cdnMap = preRenderConfig.cdnMaps.find(
      ({ regExp }) => regExp.test(url),
    );
    if (!cdnMap) {
      req.continue();
      return;
    }
    const newUrl = url.replace(
      cdnMap.regExp,
      `${staticServerHost}${cdnMap.targetPath}`,
    );
    req.continue({ url: newUrl });
  });
  await injectProperty(page);
  await hooks[PreRenderCliHook.beforeLoadPage].promise(
    page,
  );
  await page.goto(url);
  await captureAfter(page, route);
  await hooks[PreRenderCliHook.afterCapture].promise(page);
  const content = await page.content();
  await page.close();
  return content;
}

async function startBuildPreRenderPages(): Promise<void> {
  const browser = await puppeteer.launch({});
  await Promise.all(
    preRenderConfig.routes.map(async route => {
      await semaphore.acquire();
      try {
        const preRenderHTML = await preRenderPage({
          browser,
          route,
        });
        const toSavePath = route.outputPath
          ? route.outputPath
          : path.resolve(
              preRenderConfig.server.staticDir,
              `./${route.path}`,
            );
        console.log(
          colors.green('[preRenterHtml out path]:') +
            colors.gray(toSavePath),
        );
        await savePreRenderHTML(toSavePath, preRenderHTML);
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
  await browser.close();
}

export { startBuildPreRenderPages, preRenderPage };
