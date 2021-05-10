/** @format */

const path = require('path');

module.exports = {
  server: {
    staticDir: path.resolve(__dirname, './testDist'),
    port: 8000,
  },
  routes: [
    {
      path: '/page1/index.html',
      outputPath: path.resolve(
        __dirname,
        './testDist/page1/index-prerender.html',
      ),
    },
  ],
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
  injectConfig: {
    propertyName: 'isPreRender',
    value: true,
  },
};
