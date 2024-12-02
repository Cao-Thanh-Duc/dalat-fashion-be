import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  UserName: string;

  @ApiProperty()
  @IsEmail()
  Email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  Password: string;
}
