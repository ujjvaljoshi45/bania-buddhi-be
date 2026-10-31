import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOtpDto {
    @ApiProperty({
        type: 'string',
        example: '1234',
        description: 'OTP received by the user',
    })
    @IsNotEmpty()
    @IsString()
    otp: string;

    @ApiProperty({
        type: 'string',
        example: '1234567890',
        description: 'Reference ID received when generating OTP',
    })
    @IsNotEmpty()
    @IsString()
    referenceId: string;

    @IsBoolean()
    isFromAuth: boolean = false;
}
