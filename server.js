const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const historyApiFallback = require('connect-history-api-fallback');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000; // The port to run the server on
const API_DIR = '/api'; // Name of the dir containing the lambda functions
const dirPath = path.join(__dirname, API_DIR); // Path to the lambda functions dir
const guiPath = path.join(__dirname, 'build');
const placeholderFilePath = path.join(__dirname, 'public', 'placeholder.html');
const handlers = {}; // Will store list of API endpoints
process.env.WC_SERVER = 'true'; // Tells middleware to return in non-lambda mode

// Enable CORS
app.use(cors({
  origin: process.env.API_CORS_ORIGIN || '*',
}));

// Read and register each API function as an Express routes
fs.readdirSync(dirPath, { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
  .forEach(dirent => {
    const routeName = dirent.name.split('.')[0];
    const route = `${API_DIR}/${routeName}`;
    const handler = require(path.join(dirPath, dirent.name));
    handlers[route] = handler;

    app.get(route, async (req, res) => {
      try {
        await handler(req, res);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  });

  // Create a single API endpoint to execute all lambda functions
  app.get('/api', async (req, res) => {
    const results = {};
    const { url } = req.query;
    const maxExecutionTime = process.env.API_TIMEOUT_LIMIT || 20000;
  
    const executeHandler = async (handler, req, res) => {
      return new Promise(async (resolve, reject) => {
        try {
          const mockRes = {
            status: (statusCode) => mockRes,
            json: (body) => resolve({ body }),
          };
          await handler({ ...req, query: { url } }, mockRes);
        } catch (err) {
          reject(err);
        }
      });
    };
  
    const timeout = (ms, jobName = null) => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(
            `Timed out after ${ms/1000} seconds${jobName ? `, when executing ${jobName}` : ''}`
          ));
        }, ms);
      });
    };
  
    const handlerPromises = Object.entries(handlers).map(async ([route, handler]) => {
      const routeName = route.replace(`${API_DIR}/`, '');
  
      try {
        const result = await Promise.race([
          executeHandler(handler, req, res),
          timeout(maxExecutionTime, routeName)
        ]);
        results[routeName] = result.body;
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
    { from: /^\/api\/.*$/, to: (context) => context.parsedUrl.path },
  ]
}));

// Serve up the GUI - if build dir exists, and GUI feature enabled
if (process.env.DISABLE_GUI && process.env.DISABLE_GUI !== 'false') {
  app.get('*', async (req, res) => {
    const placeholderContent = await fs.promises.readFile(placeholderFilePath, 'utf-8');
    const htmlContent = placeholderContent.replace(
      '<!-- CONTENT -->', 
      'Web-Check API is up and running!<br />Access the endpoints at '
      +'<a href="/api"><code>/api</code></a>'
    );

    res.status(500).send(htmlContent);
  });
} else if (!fs.existsSync(guiPath)) {
  app.get('*', async (req, res) => {
    const placeholderContent = await fs.promises.readFile(placeholderFilePath, 'utf-8');
    const htmlContent = placeholderContent.replace(
      '<!-- CONTENT -->', 
      'Looks like the GUI app has not yet been compiled.<br /> ' +
      'Run <code>yarn build</code> to continue, then restart the server.'
    );
    res.status(500).send(htmlContent);
});
} else { // GUI enabled, and build files present, let's go!!
  app.use(express.static(guiPath));
}

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Print nice welcome message to user
const printMessage = () => {
  console.log(
    `\x1b[36m\n` +
    '    __      __   _         ___ _           _   \n' +
    '    \\ \\    / /__| |__ ___ / __| |_  ___ __| |__\n' +
    '     \\ \\/\\/ / -_) \'_ \\___| (__| \' \\/ -_) _| / /\n' +
    '      \\_/\\_/\\___|_.__/    \\___|_||_\\___\\__|_\\_\\\n' +
    `\x1b[0m\n`,
    `\x1b[1m\x1b[32m🚀 Web-Check is up and running at http://localhost:${port} \x1b[0m\n\n`,
    `\x1b[2m\x1b[36m🛟 For documentation and support, visit the GitHub repo: ` +
    `https://github.com/lissy93/web-check \n`,
    `💖 Found Web-Check useful? Consider sponsoring us on GitHub ` +
    `to help fund maintenance & development.\x1b[0m`
  );
};

// Create server
app.listen(port, () => {
  printMessage();
});

