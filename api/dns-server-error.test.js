import test from 'node:test';
import assert from 'node:assert/strict';

import { describeDnsServerLookupError } from './dns-server-error.js';

test('dns-server ENODATA errors name the domain and missing NS records', () => {
  const error = new Error('queryNs ENODATA example.com');
  error.code = 'ENODATA';

  assert.deepEqual(describeDnsServerLookupError(error, 'example.com'), {
    error: 'DNS server lookup failed: no NS records were returned for example.com',
  });
});

test('dns-server ENOTFOUND errors name the unresolved domain', () => {
  const error = new Error('queryNs ENOTFOUND missing.example');
  error.code = 'ENOTFOUND';

  assert.deepEqual(describeDnsServerLookupError(error, 'missing.example'), {
    error: 'DNS server lookup failed: missing.example could not be resolved',
  });
});
