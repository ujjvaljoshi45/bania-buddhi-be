import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateOtpDto {
    @ApiProperty({
        type: 'string',
        example: '9876543210',
        description: 'Phone Number of the user',
    })
    @IsNotEmpty()
    @IsString()
    phoneNo: string;
}
