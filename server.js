const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const fs = require('fs');
const path = require('path');

const app = express();

// Read the '/api' directory and import each lambda function
const handlers = {};
fs.readdirSync(path.join(__dirname, '/api')).forEach(file => {
  const route = `/api/${file.split('.')[0]}`; // remove .js extension
  const handler = require(path.join(__dirname, '/api', file)).handler;
  handlers[route] = handler;
  
  app.get(route, async (req, res) => {
    try {
      const result = await new Promise((resolve, reject) => {
        const cb = (err, response) => err ? reject(err) : resolve(response);
        const promise = handler(req, {}, cb);
        if (promise && typeof promise.then === 'function') {
          promise.then(resolve).catch(reject);
        }
      });
      res.status(result.statusCode).json(JSON.parse(result.body));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.get('/api', async (req, res) => {
  const results = {};
  const url = req.query.url;
  const handlerPromises = Object.entries(handlers).map(async ([route, handler]) => {
    try {
      const result = await new Promise((resolve, reject) => {
        const cb = (err, response) => err ? reject(err) : resolve(response);
        const promise = handler({ query: { url } }, {}, cb);
        if (promise && typeof promise.then === 'function') {
          promise.then(resolve).catch(reject);
        }
      });
      results[route.slice(5)] = JSON.parse(result.body);  // remove '/api/' prefix
    } catch (err) {
      results[route.slice(5)] = { error: err.message };
    }
  });

  await Promise.all(handlerPromises);
  res.json(results);
});

// Create serverless express server
const server = awsServerlessExpress
.createServer(app)
.listen(3001, () => {
  console.log('Listening on port 3001');
});

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
};
