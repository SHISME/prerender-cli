## prerender-cli-mock

A prerender-cli plugin help you to create mock server.
It rely on [express-mock-api-middleware](https://github.com/TechStark/express-mock-api-middleware) 

## Usage

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
