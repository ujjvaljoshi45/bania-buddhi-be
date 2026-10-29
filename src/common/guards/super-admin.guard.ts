import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseDto } from '../dtos/response.dto.js';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        ResponseDto.error(null, 'Unauthorized: User not authenticated', HttpStatus.UNAUTHORIZED),
      );
    }

    if (!user.isSuperAdmin) {
      throw new ForbiddenException(
        ResponseDto.error(
          null,
          'Forbidden: Super Admin privileges required',
          HttpStatus.FORBIDDEN,
        ),
      );
    }

    return true;
  }
}

