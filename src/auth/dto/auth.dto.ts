import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber } from 'class-validator';

export class RegistrationDto {
    @ApiProperty({ default: 'example@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ default: 'password123' })
    password: string;
}

export class UserDto {
    @IsEmail()
    email: string;

    @IsNumber()
    id: string;
}