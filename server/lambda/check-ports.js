const net = require('net');

// A list of commonly used ports.
const PORTS = [
  20, 21, 22, 23, 25, 53, 80, 67, 68, 69,
  110, 119, 123, 143, 156, 161, 162, 179, 194,
  389, 443, 587, 993, 995,
  3000, 3306, 3389, 5060, 5900, 8000, 8080, 8888
];

async function checkPort(port, domain) {
    return new Promise(resolve => {
        const socket = new net.Socket();

        socket.setTimeout(1500); // you may want to adjust the timeout

        socket.once('connect', () => {
            socket.destroy();
            resolve(port);
        });

        socket.once('timeout', () => {
          socket.destroy();
        });

        socket.once('error', (e) => {
            socket.destroy();
        });
        socket.connect(port, domain);
    });
}

exports.handler = async (event, context) => {
  const domain = event.queryStringParameters.url;
  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'domain' parameter" }),
    };
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const timeout = delay(9000);

  const openPorts = [];
  const failedPorts = [];

  const promises = PORTS.map(port => checkPort(port, domain)
    .then(() => {
      openPorts.push(port);
      return { status: 'fulfilled', port };
    })
    .catch(() => {
      failedPorts.push(port);
      return { status: 'rejected', port };
    }));

  let timeoutReached = false;

  for (const promise of promises) {
    const result = await Promise.race([promise, timeout.then(() => ({ status: 'timeout', timeout: true }))]);
    if (result.status === 'timeout') {
      timeoutReached = true;
      if (result.timeout) {
        // Add the ports not checked yet to the failedPorts array
        const checkedPorts = [...openPorts, ...failedPorts];
        const portsNotChecked = PORTS.filter(port => !checkedPorts.includes(port));
        failedPorts.push(...portsNotChecked);
      }
      break;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ timeout: timeoutReached, openPorts, failedPorts }),
  };
};



