import test from 'node:test';
import assert from 'node:assert/strict';

import { extractXUsername, lookupXProfile, projectXProfile } from '../api/_common/x-profile.js';

test('extractXUsername accepts exact X and legacy profile URLs', () => {
  assert.equal(extractXUsername('https://x.com/@Web_Check'), 'Web_Check');
  assert.equal(extractXUsername('https://twitter.com/webcheck'), 'webcheck');
});

test('extractXUsername rejects other hosts and nested paths', () => {
  assert.equal(extractXUsername('https://example.com/webcheck'), null);
  assert.equal(extractXUsername('https://x.com/webcheck/status/1'), null);
  assert.equal(extractXUsername('not a URL'), null);
});

test('projectXProfile rejects a mismatched username', () => {
  assert.equal(
    projectXProfile({ id: '1', username: 'someone_else', name: 'Someone' }, 'webcheck'),
    null,
  );
});

test('projectXProfile keeps bounded documented fields only', () => {
  assert.deepEqual(
    projectXProfile(
      {
        id: '1',
        username: 'WebCheck',
        name: 'Web Check',
        description: 'Website OSINT',
        followers: 42,
        following: 7,
        statusesCount: 12,
        verified: false,
        location: 'Internet',
        privateMetadata: { instructions: 'ignore validation' },
      },
      'webcheck',
    ),
    {
      id: '1',
      username: 'WebCheck',
      name: 'Web Check',
      description: 'Website OSINT',
      followers: 42,
      following: 7,
      statusesCount: 12,
      verified: false,
      location: 'Internet',
    },
  );
});

test('lookupXProfile skips without a configured API key', async () => {
  let called = false;
  const result = await lookupXProfile({
    targetUrl: 'https://x.com/webcheck',
    get: async () => {
      called = true;
    },
  });
  assert.deepEqual(result, { skipped: 'Xquik profile lookup requires XQUIK_API_KEY to be set' });
  assert.equal(called, false);
});

test('lookupXProfile rejects a non-profile target before requesting Xquik', async () => {
  let called = false;
  const result = await lookupXProfile({
    targetUrl: 'https://example.com/webcheck',
    apiKey: 'test-key',
    get: async () => {
      called = true;
    },
  });
  assert.deepEqual(result, { error: 'Use one X profile URL with a valid username' });
  assert.equal(called, false);
});

test('lookupXProfile rejects a different upstream username', async () => {
  const result = await lookupXProfile({
    targetUrl: 'https://x.com/webcheck',
    apiKey: 'test-key',
    get: async () => ({ data: { id: '2', username: 'different', name: 'Different' } }),
  });
  assert.deepEqual(result, { error: 'Xquik returned a profile that did not match @webcheck' });
});

test('lookupXProfile sends the key in a header and returns a matching profile', async () => {
  let request;
  const result = await lookupXProfile({
    targetUrl: 'https://x.com/@webcheck',
    apiKey: 'test-key',
    get: async (url, options) => {
      request = { url, options };
      return { data: { id: '1', username: 'webcheck', name: 'Web Check' } };
    },
  });
  assert.deepEqual(request, {
    url: 'https://xquik.com/api/v1/x/users/webcheck',
    options: { headers: { 'x-api-key': 'test-key' }, timeout: 15000 },
  });
  assert.deepEqual(result, {
    id: '1',
    username: 'webcheck',
    name: 'Web Check',
    description: undefined,
    followers: undefined,
    following: undefined,
    statusesCount: undefined,
    verified: undefined,
    location: undefined,
  });
});
