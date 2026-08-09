import test from 'node:test';
import assert from 'node:assert/strict';

import {
  registrableDomain,
  stripHtml,
  classifyDataClass,
  parseBreaches,
  sortBreaches,
  summariseBreaches,
} from './breach-history.js';

// --- registrableDomain -------------------------------------------------------

// HIBP indexes breaches against the registrable domain, so store.adobe.com has
// to be folded down to adobe.com or the lookup silently returns nothing
test('registrableDomain folds subdomains down to the registrable domain', () => {
  assert.equal(registrableDomain('store.adobe.com'), 'adobe.com');
  assert.equal(registrableDomain('adobe.com'), 'adobe.com');
  assert.equal(registrableDomain('www.jcjk.pl'), 'jcjk.pl');
});

test('registrableDomain handles multi-part public suffixes', () => {
  assert.equal(registrableDomain('shop.example.co.uk'), 'example.co.uk');
  assert.equal(registrableDomain('example.co.uk'), 'example.co.uk');
});

test('registrableDomain lowercases the result', () => {
  assert.equal(registrableDomain('ROBLOX.COM'), 'roblox.com');
  assert.equal(registrableDomain('Store.Adobe.Com'), 'adobe.com');
});

test('registrableDomain falls back to the input when there is no public suffix', () => {
  assert.equal(registrableDomain('localhost'), 'localhost');
  assert.equal(registrableDomain(''), '');
  assert.equal(registrableDomain(null), '');
});

// --- stripHtml ---------------------------------------------------------------

// HIBP descriptions ship raw markup, and piping third-party HTML into the DOM
// is the exact bug this tool exists to find on other people's sites
test('stripHtml removes the markup HIBP embeds in descriptions', () => {
  const raw =
    'In October 2013, 153 million Adobe accounts were breached with each containing an ' +
    'internal ID, username, email, <em>encrypted</em> password and a password hint in plain ' +
    'text. The unencrypted hints also <a href="http://troyhunt.com/x" target="_blank" ' +
    'rel="noopener">disclosed much about the passwords</a> adding further to the risk.';
  const text = stripHtml(raw);
  assert.ok(!text.includes('<'), 'no tags should survive');
  assert.ok(!text.includes('href'), 'no attributes should survive');
  assert.ok(text.includes('encrypted password'));
  assert.ok(text.includes('disclosed much about the passwords'));
});

test('stripHtml decodes the entities that appear in HIBP copy', () => {
  assert.equal(stripHtml('Ashley &amp; Madison'), 'Ashley & Madison');
  assert.equal(stripHtml('&quot;quoted&quot;'), '"quoted"');
  assert.equal(stripHtml('it&#x27;s'), "it's");
  assert.equal(stripHtml('a&nbsp;b'), 'a b');
  assert.equal(stripHtml('&lt;script&gt;'), '<script>');
});

test('stripHtml collapses the whitespace left behind by removed tags', () => {
  assert.equal(stripHtml('<p>one</p>   <p>two</p>'), 'one two');
});

// A tag sitting between a word and its punctuation would otherwise leave the
// gap behind: "...passwords exposed</a>." reading as "passwords exposed ."
test('stripHtml does not leave a gap before punctuation', () => {
  assert.equal(
    stripHtml('email addresses and passwords <a href="#">exposed</a>.'),
    'email addresses and passwords exposed.',
  );
  assert.equal(stripHtml('one <em>two</em> , three'), 'one two, three');
  assert.equal(stripHtml('is it <b>so</b> ?'), 'is it so?');
});

test('stripHtml tolerates empty and non-string input', () => {
  assert.equal(stripHtml(''), '');
  assert.equal(stripHtml(null), '');
  assert.equal(stripHtml(undefined), '');
  assert.equal(stripHtml(42), '');
});

// --- classifyDataClass -------------------------------------------------------

test('classifyDataClass treats credentials and financial data as critical', () => {
  for (const cls of [
    'Passwords',
    'Historical passwords',
    'Security questions and answers',
    'Auth tokens',
    'Credit cards',
    'Bank account numbers',
    'Government issued IDs',
    'Passport numbers',
  ]) {
    assert.equal(classifyDataClass(cls), 'critical', cls);
  }
});

test('classifyDataClass treats data enabling targeted attacks as high', () => {
  for (const cls of [
    'Password hints',
    'Partial credit card data',
    'Dates of birth',
    'Physical addresses',
    'Phone numbers',
    'Private messages',
  ]) {
    assert.equal(classifyDataClass(cls), 'high', cls);
  }
});

test('classifyDataClass treats plain identifiers as medium', () => {
  for (const cls of ['Email addresses', 'Usernames', 'Names', 'IP addresses']) {
    assert.equal(classifyDataClass(cls), 'medium', cls);
  }
});

test('classifyDataClass defaults unknown classes to low rather than guessing', () => {
  assert.equal(classifyDataClass('Spoken languages'), 'low');
  assert.equal(classifyDataClass('Something HIBP added last week'), 'low');
  assert.equal(classifyDataClass(''), 'low');
  assert.equal(classifyDataClass(null), 'low');
});

// --- parseBreaches -----------------------------------------------------------

const adobe = {
  Name: 'Adobe',
  Title: 'Adobe',
  Domain: 'adobe.com',
  BreachDate: '2013-10-04',
  AddedDate: '2013-12-04T00:00:00Z',
  ModifiedDate: '2022-05-15T23:52:49Z',
  PwnCount: 152445165,
  Description: 'In October 2013, <em>153 million</em> Adobe accounts were breached.',
  LogoPath: 'https://logos.haveibeenpwned.com/Adobe.png',
  DataClasses: ['Email addresses', 'Password hints', 'Passwords', 'Usernames'],
  IsVerified: true,
  IsFabricated: false,
  IsSensitive: false,
  IsRetired: false,
  IsSpamList: false,
  IsMalware: false,
  IsStealerLog: false,
};

test('parseBreaches maps the HIBP record onto our shape', () => {
  const [b] = parseBreaches([adobe]);
  assert.equal(b.name, 'Adobe');
  assert.equal(b.title, 'Adobe');
  assert.equal(b.domain, 'adobe.com');
  assert.equal(b.breachDate, '2013-10-04');
  assert.equal(b.accounts, 152445165);
  assert.equal(b.logo, 'https://logos.haveibeenpwned.com/Adobe.png');
  assert.equal(b.verified, true);
});

test('parseBreaches strips the HTML out of the description', () => {
  const [b] = parseBreaches([adobe]);
  assert.equal(b.description, 'In October 2013, 153 million Adobe accounts were breached.');
});

test('parseBreaches tiers each data class and sorts the worst first', () => {
  const [b] = parseBreaches([adobe]);
  assert.deepEqual(b.dataClasses, [
    { name: 'Passwords', tier: 'critical' },
    { name: 'Password hints', tier: 'high' },
    { name: 'Email addresses', tier: 'medium' },
    { name: 'Usernames', tier: 'medium' },
  ]);
});

test('parseBreaches derives breach severity from the worst data class', () => {
  assert.equal(parseBreaches([adobe])[0].severity, 'critical');
  const emailOnly = { ...adobe, DataClasses: ['Email addresses', 'Job titles'] };
  assert.equal(parseBreaches([emailOnly])[0].severity, 'medium');
  const nothing = { ...adobe, DataClasses: [] };
  assert.equal(parseBreaches([nothing])[0].severity, 'low');
});

test('parseBreaches carries the flags that qualify how much a breach is worth trusting', () => {
  const dubious = {
    ...adobe,
    IsVerified: false,
    IsFabricated: true,
    IsSpamList: true,
    IsStealerLog: true,
    IsMalware: true,
    IsSensitive: true,
    IsRetired: true,
  };
  const [b] = parseBreaches([dubious]);
  assert.equal(b.verified, false);
  assert.equal(b.fabricated, true);
  assert.equal(b.spamList, true);
  assert.equal(b.stealerLog, true);
  assert.equal(b.malware, true);
  assert.equal(b.sensitive, true);
  assert.equal(b.retired, true);
});

test('parseBreaches marks unverified, fabricated or spam-list entries as not trustworthy', () => {
  assert.equal(parseBreaches([adobe])[0].trustworthy, true);
  assert.equal(parseBreaches([{ ...adobe, IsVerified: false }])[0].trustworthy, false);
  assert.equal(parseBreaches([{ ...adobe, IsFabricated: true }])[0].trustworthy, false);
  assert.equal(parseBreaches([{ ...adobe, IsSpamList: true }])[0].trustworthy, false);
});

test('parseBreaches returns [] for empty or malformed input', () => {
  assert.deepEqual(parseBreaches([]), []);
  assert.deepEqual(parseBreaches(null), []);
  assert.deepEqual(parseBreaches(undefined), []);
  assert.deepEqual(parseBreaches('nope'), []);
  assert.deepEqual(parseBreaches([null, 'nope', 42]), []);
});

test('parseBreaches skips records with no identifying name', () => {
  assert.deepEqual(parseBreaches([{ Domain: 'x.com', DataClasses: [] }]), []);
});

test('parseBreaches copes with a record missing every optional field', () => {
  const [b] = parseBreaches([{ Name: 'Bare' }]);
  assert.equal(b.name, 'Bare');
  assert.equal(b.accounts, null);
  assert.equal(b.breachDate, null);
  assert.deepEqual(b.dataClasses, []);
  assert.equal(b.severity, 'low');
  assert.equal(b.description, '');
});

// --- sortBreaches ------------------------------------------------------------

const make = (over) => parseBreaches([{ ...adobe, ...over }])[0];

test('sortBreaches puts trustworthy breaches ahead of unverified ones', () => {
  const sorted = sortBreaches([
    make({ Name: 'Doubtful', IsVerified: false }),
    make({ Name: 'Solid' }),
  ]);
  assert.deepEqual(
    sorted.map((b) => b.name),
    ['Solid', 'Doubtful'],
  );
});

test('sortBreaches ranks by severity, then by most recent', () => {
  const sorted = sortBreaches([
    make({ Name: 'OldCreds', BreachDate: '2010-01-01' }),
    make({ Name: 'RecentEmails', BreachDate: '2023-01-01', DataClasses: ['Email addresses'] }),
    make({ Name: 'NewCreds', BreachDate: '2021-01-01' }),
  ]);
  assert.deepEqual(
    sorted.map((b) => b.name),
    ['NewCreds', 'OldCreds', 'RecentEmails'],
  );
});

test('sortBreaches does not mutate its input', () => {
  const list = [make({ Name: 'B', IsVerified: false }), make({ Name: 'A' })];
  sortBreaches(list);
  assert.equal(list[0].name, 'B');
});

// --- summariseBreaches -------------------------------------------------------

test('summariseBreaches totals the incidents, accounts and worst severity', () => {
  const summary = summariseBreaches([
    make({ Name: 'One', PwnCount: 100, BreachDate: '2013-10-04' }),
    make({ Name: 'Two', PwnCount: 50, BreachDate: '2019-02-01', DataClasses: ['Email addresses'] }),
  ]);
  assert.equal(summary.total, 2);
  assert.equal(summary.totalAccounts, 150);
  assert.equal(summary.worstSeverity, 'critical');
  assert.equal(summary.latestBreachDate, '2019-02-01');
  assert.equal(summary.verifiedCount, 2);
});

test('summariseBreaches ignores unknown account counts rather than treating them as zero', () => {
  const summary = summariseBreaches([make({ PwnCount: null }), make({ PwnCount: 10 })]);
  assert.equal(summary.totalAccounts, 10);
});

test('summariseBreaches reports a clean domain', () => {
  const summary = summariseBreaches([]);
  assert.equal(summary.total, 0);
  assert.equal(summary.totalAccounts, 0);
  assert.equal(summary.worstSeverity, null);
  assert.equal(summary.latestBreachDate, null);
  assert.equal(summary.verifiedCount, 0);
});
