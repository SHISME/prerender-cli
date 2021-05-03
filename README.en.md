## Prerender-cli

A cli tool help you to generate skeleton page.

This tool will start a static server, and use puppeteer to 

## Usage

### Step 1

> npm install prerender-cli --save-dev

### Step 2

Set prerender config,in your project

```javascript
// prerender.config.js
const path = require('path');

module.exports = {
  server: {
    staticDir: path.resolve(__dirname, './testDist'),
    port: 8000,
  },
  routes: [
    {
      path: '/page1/index.html',
    },
  ],
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
  injectConfig: {
    propertyName: 'isPreRender',
    value: true,
  },
};

```


