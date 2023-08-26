const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const fs = require('fs');
const path = require('path');
const historyApiFallback = require('connect-history-api-fallback');
require('dotenv').config();

const app = express();

const API_DIR = '/api'; // Name of the dir containing the lambda functions
const dirPath = path.join(__dirname, API_DIR); // Path to the lambda functions dir
const guiPath = path.join(__dirname, 'build');

// Execute the lambda function
const executeHandler = async (handler, req) => {
  return new Promise((resolve, reject) => {
    const callback = (err, response) => err ? reject(err) : resolve(response);
    const promise = handler(req, {}, callback);

    if (promise && typeof promise.then === 'function') {
      promise.then(resolve).catch(reject);
    }
  });
};

// Array of all the lambda function file names
const fileNames = fs.readdirSync(dirPath, { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
  .map(dirent => dirent.name);

const handlers = {};

fileNames.forEach(file => {
  const routeName = file.split('.')[0];
  const route = `${API_DIR}/${routeName}`;
  const handler = require(path.join(dirPath, file)).handler;

  handlers[route] = handler;
  
  app.get(route, async (req, res) => {
    try {
      const { statusCode = 200, body = '' } = await executeHandler(handler, req);
      res.status(statusCode).json(JSON.parse(body));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

const timeout = (ms, jobName = null) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out after the ${ms/1000} second limit${jobName ? `, when executing the ${jobName} task` : ''}`));
    }, ms);
  });
}

app.get('/api', async (req, res) => {
  const results = {};
  const { url } = req.query;
  const maxExecutionTime = process.env.API_TIMEOUT_LIMIT || 15000;

  const handlerPromises = Object.entries(handlers).map(async ([route, handler]) => {
    const routeName = route.replace(`${API_DIR}/`, '');

    try {
      const result = await Promise.race([
        executeHandler(handler, { query: { url } }),
        timeout(maxExecutionTime, routeName)
      ]);
      results[routeName] = JSON.parse((result || {}).body);
      
    } catch (err) {
      results[routeName] = { error: err.message };
    }
  });

  await Promise.all(handlerPromises);
  res.json(results);
});

// Handle SPA routing
app.use(historyApiFallback({
  rewrites: [
    { from: /^\/api\/.*$/, to: function(context) { return context.parsedUrl.path; } },
  ]
}));

// Serve up the GUI - if build dir exists, and GUI feature enabled
if (process.env.DISABLE_GUI && process.env.DISABLE_GUI !== 'false') {
  app.get('*', (req, res) => {
      res.status(500).send(
        'Welcome to Web-Check!<br />Access the API endpoints at '
        +'<a href="/api"><code>/api</code></a>'
      );
  });
} else if (!fs.existsSync(guiPath)) {
  app.get('*', (req, res) => {
    res.status(500).send(
      'Welcome to Web-Check!<br />Looks like the GUI app has not yet been compiled, '
      +'run <code>yarn build</code> to continue, then restart the server.'
    );
});
} else { // GUI enabled, and build files present, let's go!!
  app.use(express.static(guiPath));
}

// Create serverless express server
const port = process.env.PORT || 3000;
const server = awsServerlessExpress.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
