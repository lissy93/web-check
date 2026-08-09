import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import { assertSafeUrl, installSsrfGuards } from './ssrf.js';

const publicLookup = async () => [{ address: '93.184.216.34', family: 4 }];

test('allows public HTTP and HTTPS targets', async () => {
  assert.equal(
    await assertSafeUrl('https://example.com/path', publicLookup),
    'https://example.com/path',
  );
  assert.equal(await assertSafeUrl('http://1.1.1.1'), 'http://1.1.1.1/');
  assert.equal(
    await assertSafeUrl('http://[2001:4860:4860::8888]'),
    'http://[2001:4860:4860::8888]/',
  );
});

test('blocks private and non-routable IP address forms', async () => {
  const targets = [
    'http://0.0.0.0',
    'http://10.0.0.1',
    'http://127.0.0.1',
    'http://169.254.169.254/latest/meta-data',
    'http://172.16.0.1',
    'http://192.168.0.1',
    'http://2130706433',
    'http://0x7f000001',
    'http://127.1',
    'http://[::1]',
    'http://[::ffff:127.0.0.1]',
    'http://[fe80::1]',
    'http://[fc00::1]',
  ];

  for (const target of targets) {
    await assert.rejects(assertSafeUrl(target), /private or metadata address/);
  }
});

test('blocks reserved hostnames without resolving them', async () => {
  let lookupCalled = false;
  const lookup = async () => {
    lookupCalled = true;
    return [{ address: '93.184.216.34', family: 4 }];
  };

  for (const target of [
    'http://localhost',
    'http://service.local',
    'http://service.internal',
    'http://metadata.google.internal',
  ]) {
    await assert.rejects(assertSafeUrl(target, lookup), /hostname is blocked/);
  }
  assert.equal(lookupCalled, false);
});

test('checks every resolved address', async () => {
  const lookup = async () => [
    { address: '93.184.216.34', family: 4 },
    { address: '127.0.0.1', family: 4 },
  ];

  await assert.rejects(
    assertSafeUrl('https://mixed.example', lookup),
    /private or metadata address/,
  );
});

test('rejects unsupported schemes and embedded credentials', async () => {
  await assert.rejects(assertSafeUrl('file:///etc/passwd'), /scheme not allowed/);
  await assert.rejects(
    assertSafeUrl('https://user:password@example.com', publicLookup),
    /credentials are not allowed/,
  );
});

test('allows private targets only when explicitly configured', async () => {
  const previous = process.env.ALLOW_PRIVATE_TARGETS;
  process.env.ALLOW_PRIVATE_TARGETS = 'true';
  try {
    assert.equal(await assertSafeUrl('http://127.0.0.1'), 'http://127.0.0.1/');
  } finally {
    if (previous === undefined) {
      delete process.env.ALLOW_PRIVATE_TARGETS;
    } else {
      process.env.ALLOW_PRIVATE_TARGETS = previous;
    }
  }
});

test('blocks direct private addresses passed as request options', () => {
  installSsrfGuards();
  assert.throws(
    () => http.get({ hostname: '127.0.0.1', path: '/' }),
    /private or metadata address/,
  );
});
