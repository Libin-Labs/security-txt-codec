import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('parses required fields', () => {
  const x = api.parseSecurityTxt(
    'Contact: mailto:security@example.com\nExpires: 2030-01-01T00:00:00Z',
  );
  assert.deepEqual(x.Contact, ['mailto:security@example.com']);
});
test('preserves repeated contacts', () => {
  assert.equal(
    api.parseSecurityTxt(
      'Contact: https://a.test\nContact: mailto:b@x.test\nExpires: 2030-01-01T00:00:00Z',
    ).Contact.length,
    2,
  );
});
test('ignores comment lines', () => {
  assert.equal(
    api.parseSecurityTxt('# note\nContact: https://a.test\nExpires: 2030-01-01T00:00:00Z')
      .Contact[0],
    'https://a.test',
  );
});
test('formats deterministically', () => {
  const x = { Contact: ['mailto:a@example.com'], Expires: ['2030-01-01T00:00:00Z'] };
  assert.equal(
    api.formatSecurityTxt(x),
    'Contact: mailto:a@example.com\nExpires: 2030-01-01T00:00:00Z',
  );
});
test('requires contact', () => {
  assert.throws(() => api.parseSecurityTxt('Expires: 2030-01-01T00:00:00Z'), TypeError);
});
test('rejects invalid UTC expiration', () => {
  assert.throws(() => api.parseSecurityTxt('Contact: https://a.test\nExpires: never'), TypeError);
});
