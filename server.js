const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

const handlers = {};

const dirPath = path.join(__dirname, '/api');

const fileNames = fs.readdirSync(dirPath, { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
  .map(dirent => dirent.name);

fileNames.forEach(file => {
  const route = `/api/${file.split('.')[0]}`;
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
const port = process.env.API_PORT || 3001;
const server = awsServerlessExpress
.createServer(app)
.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
};
