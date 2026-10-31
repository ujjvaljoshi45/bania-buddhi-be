import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { GenerateOtpDto } from './dto/generate.otp.dto.js';
import { Utils } from '../common/utils/utils.js';
import { ConfirmOtpDto } from './dto/confirm.otp.dto.js';
import { EncryptionDecryptionUtil } from '../common/utils/encryption-decryption.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly encryptionDecryptionUtil: EncryptionDecryptionUtil, private readonly jwtService: JwtService) { }

    async generateOTP(data: GenerateOtpDto, token: string | null) {
        const { phoneNo } = data;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const referenceId = Utils.generateReferenceId();

        await this.prismaService.otpLog.updateMany({
            where: { phoneNo, status: 'PENDING' }, data: {
                status: 'EXPIRED'
            }
        })

        await this.prismaService.otpLog.create({
            data: {
                referenceId,
                phoneNo,
                otp,
            },
        });
        return { message: 'OTP sent successfully', referenceId };
    }

    async confirmOTP(data: ConfirmOtpDto) {
        const { otp, referenceId } = data;
        const otpLog = await this.prismaService.otpLog.findUnique({
            where: {
                referenceId,
            },
        });
        if (!otpLog) {
            throw new Error('Invalid OTP');
        }
        if (otpLog.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        // Difference createdAt and now if > 5 min consider it expired
        if (Date.now() - otpLog.createdAt.getTime() > 300000) {
            throw new Error('OTP expired');
        }
        await this.prismaService.otpLog.update({
            where: {
                referenceId,
            },
            data: {
                status: 'VERIFIED',
            },
        });
        const user = (data.isFromAuth) ? await this.prismaService.user.findUnique({
            where: {
                phoneNo: otpLog.phoneNo,
            },
        }) : null;

        const token = user ? this.jwtService.sign((this.encryptionDecryptionUtil.encrypt(JSON.stringify(user)))) : null;

        return { message: 'OTP verified successfully', ...(token ? { token: token } : {}), ...(user ? { user: user } : {}) };
    }
}
