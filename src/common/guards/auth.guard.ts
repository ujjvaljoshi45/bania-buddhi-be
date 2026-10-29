import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResponseDto } from '../dtos/response.dto.js';
import { EncryptionDecryptionUtil } from '../utils/encryption-decryption.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private edUtil: EncryptionDecryptionUtil,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        ResponseDto.error(null, 'Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    }

    try {
      let rawToken = token;
      // If token is encrypted (format: iv:authTag:encrypted), decrypt it
      if (token.includes(':')) {
        try {
          rawToken = this.edUtil.decrypt(token);
        } catch {
          throw new UnauthorizedException(
            ResponseDto.error(null, 'Unauthorized: Invalid token format', HttpStatus.UNAUTHORIZED),
          );
        }
      }

      const payload = await this.jwtService.verifyAsync(rawToken);

      if (payload && payload.isActive === false) {
        throw new UnauthorizedException(
          ResponseDto.error(null, 'User Not Active', HttpStatus.FORBIDDEN),
        );
      }

      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        ResponseDto.error(null, 'Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
