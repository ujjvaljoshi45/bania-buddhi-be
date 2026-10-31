import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { GenerateOtpDto } from './dto/generate.otp.dto.js';
import { ConfirmOtpDto } from './dto/confirm.otp.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post('/generate-otp')
    @ApiOperation({ summary: 'Generate OTP for user login/registration' })
    async generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
        return this.service.generateOTP(generateOtpDto, null);
    }

    @Post('/confirm-otp')
    @ApiOperation({ summary: 'Confirm OTP' })
    async confirmOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
        return this.service.confirmOTP(confirmOtpDto);
    }
}
