## Prerender-cli

[中文文档](./README.zh.md)

A cli tool can help you build PreRender page.You can also use it to build skeleton for your web app.

## Usage

If you want to generate skeleton, you can do like this.

### Step1

> npm install prerender-cli -g

### Step2

In your project root, create `prerender.config.js`.

```javascript
// prerender.config.js
const path = require('path');

module.exports = {
  server: {
    // the path to your build result
    staticDir: path.resolve(__dirname, './testDist')
  },
  routes: [
    {
      // the route to render
      path: '/page1/index.html',
    },
  ],
  // If your page have cdn path, you can use to mapping to local path
  cdnMaps: [
    {
      regExp: /other.domain.com/g,
      targetPath: '/page1',
    },
    {
      regExp: /other.domain2.com/g,
      targetPath: '/page1',
    },
  ],
  // it will inject it to window,before render the preRender page.
  // this config will do like this window['isPreRender'] = true
  injectConfig: {
    propertyName: 'isPreRender',
    value: true,
  },
};
```

### Step3

> build-prerender 

or

> build-prerender -c yourConfig.js

## Interface

```typescript

export interface IServerConfig {
  port?: number; // the static server port,default 8888
  staticDir: string; // the path to your build result
}

export interface IRoute {
  // the route of render page
  path: string;

  // the path of the render html will be output to.
  // default to the staticPath
  outputPath?: string;
  
  // wait to render unit the element exit using by `document.querySelector`
  captureAfterElementExists?: string | string[];
  
  // wait to render unit the event is dispatched on the document.
  // with document.dispatchEvent(new Event('yourEventName'))
  captureAfterDocumentEvent?: string;
  
  // Wait to render until a certain amount of time has passed.
  captureAfterTime?: number;
}

export interface IPreRenderConfig {
  routes: IRoute[];

  // For example: proxy //other.domain.com/js/chunk-vendors.f8844798.js to /page1/js/chunk-vendors.f8844798.js
  /**
  * {
  *   regExp: /other.domain.com/g,
  *   targetPath: '/page1',
  * },
  **/ 
  cdnMaps?:{
    regExp: RegExp;
    targetPath: string;
  }[];
  server: IServerConfig;
  
  // it will inject to window
  /**
   * window.isPreRender = true; 
   *{
   *  propertyName: 'isPreRender',
   *  value: true,
   *} 
  **/
  injectConfig?: {
    propertyName: string;
    value:any;
  };
  // emulate device
  // https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  deviceName?: string;
  plugins?: PreRenderCliPlugin[];
}

```

## What is perRender page？

It like SSR(Server Side Rendering).But if you project want to use SSR, there is some reason why that is not a great idea.

- It is difficult for most of project to rebuild by ssr.
- You need to maintain a SSR services.

prerender-cli will use puppeteer to load page and build prerender page html. It will inject prerender page html to the entry html.

## prerender-cli plugin

### prerender-cli-http-proxy

It will proxy the api which in the page.

```javascript
// prerender.config.js
const PreRenderCliHttpProxyPlugin = require('prerender-cli-http-proxy');

module.exports = {
  plugins: [
    new PreRenderCliHttpProxyPlugin([
      {
        path: '/api',
        options: {
          target: 'https://www.api.server.com',
        },
      },
      {
        path: '/api2',
        options: {
          target: 'https://www.api2.server.com',
        },
      },
    ]),
  ],
};
```

### prerender-cli-mock

it dependence on [express-mock-api-middleware](https://github.com/TechStark/express-mock-api-middleware)

```javascript
// /mock/userInfo.js
module.exports = {
  'GET /api/user/info': {
    id: 101,
    userName: 'bob',
    email: 'bob@gmail.com',
    firstName: 'Bob',
    lastName: 'Bushee',
  },

  'POST /api/user/login': (req, res) => {
    const { userName, password } = req.body;
    if (userName === 'bob' && password === 'password') {
      res.send({
        success: true,
      });
    } else {
      res.send({
        success: false,
      });
    }
  },

  'GET /api/product/:id': (req, res) => {
    const { id } = req.params;
    res.sendFile(path.join(__dirname, `products/${id}.json`));
  }
};
```

```javascript
// prerender.config.js
const PrerenderCliMock = require('prerender-cli-mock');
const path = require('path');
module.exports = {
  plugins: [
    new PrerenderCliMock({
      path: path.resolve(__dirname, './mock'),
    }),
  ]
};
```

## Custom plugin

```typescript
export interface ICompiler {
  hooks: any;
}

export abstract class PreRenderCliPlugin<T> {
  protected config: T;

  public abstract apply(compiler: ICompiler): void;
}
```
### hooks

#### beforeStartStaticServer

```typescript
compiler.hooks.beforeStartStaticServer.tap('Plugin Name', (app: Express) => {})
```
#### beforeLoadPage

```typescript
compiler.hooks.beforeLoadPage.tapAsync('Plugin Name', async (page: Page) => {});
```

#### afterCapture

```typescript
compiler.hooks.afterCapture.tapAsync('Plugin Name', async (page: Page) => {});
```
