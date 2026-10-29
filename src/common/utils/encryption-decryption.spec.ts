import { describe, expect, it } from 'vitest';
import { EncryptionDecryptionUtil } from './encryption-decryption.js';

describe('EncryptionDecryptionUtil', () => {
  const util = new EncryptionDecryptionUtil();

  it('should encrypt and decrypt strings correctly', () => {
    const text = 'my-secret-jwt-token-content';
    const encrypted = util.encrypt(text);

    expect(encrypted).not.toBe(text);
    expect(encrypted.split(':')).toHaveLength(3);

    const decrypted = util.decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it('should hash and compare passwords correctly', () => {
    const password = 'SuperSecretPassword123!';
    const hash = util.hashPassword(password);

    expect(hash).not.toBe(password);
    expect(util.compare(password, hash)).toBe(true);
    expect(util.compare('wrong-password', hash)).toBe(false);
  });

  it('should generate a random password with specified length', () => {
    const password = util.generateRandomPassword(16);
    expect(password).toHaveLength(16);
  });
});

