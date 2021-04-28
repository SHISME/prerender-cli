const path = require('path');

module.exports = {
  name: 'config',
  server: {
    staticDir: path.resolve(__dirname, './packages'),
    port: 8000,
  },
};
