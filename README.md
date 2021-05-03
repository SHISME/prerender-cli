## Prerender-cli

一个帮助你构建预渲染页面的工具，你也可以利用此工具来为你的页面生成骨架屏。

## 用法

按照下面的步骤来帮助你生成骨架屏。

### Step1

> npm install prerender-cli --save-dev

### Step2

在你的项目根路径下，创建一份名为`prerender.config.js`的配置。

```javascript
// prerender.config.js
const path = require('path');

module.exports = {
  server: {
    // 打包后文件的路径
    staticDir: path.resolve(__dirname, './testDist')
  },
  routes: [
    {
      // 需要预渲染的页面路径
      path: '/page1/index.html',
    },
  ],
  // 产物中需要做cdn映射的地址
  cdnMappings: [
    {
      regExp: /other.domain.com/g,
      targetPath: '/page1',
    },
    {
      regExp: /other.domain2.com/g,
      targetPath: '/page1',
    },
  ],
  // 构建时注入到windows上的配置
  injectConfig: {
    propertyName: 'isPreRender',
    value: true,
  },
};
```

### Step3

执行命令

> build-prerender 

or

> build-prerender -c yourConfig.js

## 参数说明

```typescript

export interface IServerConfig {
  port?: number;
  staticDir: string;
}

export interface IRoute {
  path: string;
  outputPath?: string;
  captureAfterElementExists?: string | string[];
  captureAfterDocumentEvent?: string;
  captureAfterTime?: number;
}

export interface ICompiler {
  hooks: typeof hooks;
}

export abstract class PreRenderCliPlugin<T> {
  protected config: T;

  public abstract apply(compiler: ICompiler): void;
}

export interface IPreRenderConfig {
  routes: IRoute[];
  cdnMappings?:{
    regExp: RegExp;
    targetPath: string;
  }[];
  server: IServerConfig;
  injectConfig?: {
    propertyName: string;
    value:any;
  };
  plugins?: PreRenderCliPlugin<any>[];
}

```

## 什么是预渲染？

就是提前生成好静态的 HTML，用户访问的时候直接就能将页面呈现出来。这点有点类似于 SSR，但是 SSR 需要维护一个 node 或者 php 的 SSR 服务器来生成页面，通常对于我们的项目来说将项目改造成 SSR 也需要不小的开发量，并且需要前端去维护 SSR 的服务器，这点带来的收益和付出的成本往往不成正比。

而预渲染，则是通过 puppeteer 控制无头浏览器打开页面，然后将浏览器生成好的 html 注入到入口 html 中，当用户访问入口 html 的时候，看到的就是我们预渲染生成的页面了。

## cli 插件

### prerender-cli-http-proxy

这个插件能够帮助你代理转发你的接口

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

此插件依赖了[express-mock-api-middleware](https://github.com/TechStark/express-mock-api-middleware)

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




