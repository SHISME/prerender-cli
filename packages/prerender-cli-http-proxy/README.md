## prerender-cli-http-proxy

A prerender-cli plugin help you to proxy your request.

## Usage

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
