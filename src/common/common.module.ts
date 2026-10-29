import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service.js';
import { EncryptionDecryptionUtil } from './utils/encryption-decryption.js';
import { AuthGuard } from './guards/auth.guard.js';
import { SuperAdminGuard } from './guards/super-admin.guard.js';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        process.env.jwt ||
        process.env.JWT_SECREATE ||
        'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    PrismaService,
    EncryptionDecryptionUtil,
    AuthGuard,
    SuperAdminGuard,
  ],
  exports: [
    PrismaService,
    EncryptionDecryptionUtil,
    JwtModule,
    AuthGuard,
    SuperAdminGuard,
  ],
})
export class CommonModule {}

