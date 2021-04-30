/** @format */

const path = require('path');

module.exports = {
  name: 'config',
  server: {
    staticDir: path.resolve(__dirname, './testDist'),
    port: 8000,
  },
  routes: [
    {
      path: '/page1/index.html',
    },
  ],
  injectConfig: {
    propertyName: 'isPreRender',
    value: true,
  },
};
