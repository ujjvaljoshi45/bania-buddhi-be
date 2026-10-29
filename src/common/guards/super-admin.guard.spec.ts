import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { SuperAdminGuard } from './super-admin.guard.js';

describe('SuperAdminGuard', () => {
  const guard = new SuperAdminGuard();

  function createMockContext(user?: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should throw UnauthorizedException if user is not authenticated', () => {
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if user is not superadmin', () => {
    const context = createMockContext({ id: '1', isSuperAdmin: false });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should return true if user is superadmin', () => {
    const context = createMockContext({ id: '1', isSuperAdmin: true });
    expect(guard.canActivate(context)).toBe(true);
  });
});

