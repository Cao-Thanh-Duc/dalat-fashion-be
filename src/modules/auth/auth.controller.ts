import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { AuthService } from 'src/modules/auth/auth.service';
import { CurrentUser } from 'src/modules/auth/decorator/current-user.decorator';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/modules/auth/dto/auth.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { HandleAuthGuard } from 'src/modules/auth/guard/auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiResponse({ status: 200, description: 'Register Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  register(@Body() body: RegisterDto): Promise<Users> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Login Successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  login(@Body() body: LoginDto): Promise<Users> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Tạo lại access_token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu' })
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(body);
  }

  @UseGuards(HandleAuthGuard)
  @Put('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async resetPassword(
    @CurrentUser() user: Users,
    @Body() body: ResetPasswordDto,
  ): Promise<any> {
    const { newPassword } = body;
    return this.authService.resetPassword(user, newPassword);
  }

  @UseGuards(HandleAuthGuard)
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @Put('change-password')
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async changePassword(
    @CurrentUser() user: Users,
    @Body() body: ChangePasswordDto,
  ): Promise<any> {
    const { current_password, Password, confirm_password } = body;
    return this.authService.changePassword(
      user,
      current_password,
      Password,
      confirm_password,
    );
  }
}