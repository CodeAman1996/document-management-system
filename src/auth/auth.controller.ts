import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { SkipAuthGuard } from 'src/auth/skipauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuthGuard()
  async login(@Body() loginDto: LoginDto) {
    const { access_token } = await this.authService.login(loginDto);
    return {
      access_token,
      message: 'Login successful',
    };
  }
}
