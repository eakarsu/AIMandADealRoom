'use strict';

const crypto = require('crypto');

function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('Password must contain at least 12 characters');
  }
  const salt = crypto.randomBytes(16);
  const digest = crypto.scryptSync(password, salt, 32);
  return `scrypt$${salt.toString('hex')}$${digest.toString('hex')}`;
}

function verifyPassword(password, encoded) {
  if (typeof password !== 'string') return false;
  const [algorithm, saltHex, hashHex] = String(encoded || '').split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]+$/i.test(saltHex || '') || !/^[a-f0-9]+$/i.test(hashHex || '')) return false;
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch (_) {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
