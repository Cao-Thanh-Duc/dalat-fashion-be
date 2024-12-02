import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  Email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  current_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  Password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}
