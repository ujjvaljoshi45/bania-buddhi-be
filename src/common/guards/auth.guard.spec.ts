import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from './auth.guard.js';
import { JwtService } from '@nestjs/jwt';
import { EncryptionDecryptionUtil } from '../utils/encryption-decryption.js';

describe('AuthGuard', () => {
  const verifyAsyncMock = vi.fn();
  const jwtService = {
    verifyAsync: verifyAsyncMock,
  } as unknown as JwtService;

  const edUtil = new EncryptionDecryptionUtil();
  const guard = new AuthGuard(jwtService, edUtil);

  function createMockContext(authHeader?: string): {
    context: ExecutionContext;
    request: any;
  } {
    const request: any = {
      headers: {
        authorization: authHeader,
      },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    return { context, request };
  }

  it('should throw UnauthorizedException if no token is provided', async () => {
    const { context } = createMockContext(undefined);
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user is not active', async () => {
    verifyAsyncMock.mockResolvedValueOnce({
      id: '123',
      isActive: false,
    });

    const { context } = createMockContext('Bearer sample-token');
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should attach user payload to request and allow active user', async () => {
    const userPayload = { id: '123', name: 'Test User', isActive: true };
    verifyAsyncMock.mockResolvedValueOnce(userPayload);

    const { context, request } = createMockContext('Bearer sample-token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(userPayload);
  });

  it('should handle encrypted tokens properly', async () => {
    const userPayload = { id: '123', name: 'Test User', isActive: true };
    const rawJwt = 'header.payload.signature';
    const encryptedToken = edUtil.encrypt(rawJwt);

    verifyAsyncMock.mockImplementation(async (token: string) => {
      if (token === rawJwt) return userPayload;
      throw new Error('Invalid signature');
    });

    const { context, request } = createMockContext(`Bearer ${encryptedToken}`);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(userPayload);
  });
});
