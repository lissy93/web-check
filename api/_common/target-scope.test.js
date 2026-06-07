import test from 'node:test';
import assert from 'node:assert/strict';

import { isNonRoutableHost, skipIfNonRoutable } from './target-scope.js';

test('isNonRoutableHost flags RFC1918, loopback, link-local, localhost and ULA addresses', () => {
  for (const host of [
    '10.0.0.1',
    '172.16.4.5',
    '192.168.1.10',
    '127.0.0.1',
    '169.254.10.20',
    'localhost',
    'foo.localhost',
    'fc00::1',
    'fd12:3456::1',
    'fe80::1',
    '::1',
  ]) {
    assert.equal(isNonRoutableHost(host), true, host);
  }
});

test('isNonRoutableHost keeps public hosts routable', () => {
  for (const host of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', 'example.com']) {
    assert.equal(isNonRoutableHost(host), false, host);
  }
});

test('skipIfNonRoutable returns a skipped payload with context', () => {
  assert.deepEqual(skipIfNonRoutable('192.168.1.20', 'Archive lookup'), {
    skipped: 'Archive lookup only runs against publicly routable hosts',
    reason: 'non-routable-host',
    hostname: '192.168.1.20',
  });
  assert.equal(skipIfNonRoutable('example.com', 'Archive lookup'), null);
});
