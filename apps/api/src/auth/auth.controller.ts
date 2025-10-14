import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'; // Added HttpCode, HttpStatus
import { AuthService } from './auth.service';

class LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  async login(@Body() body: LoginDto) {
    return this.authService.loginWithCredentials(body.username, body.password);
  }
}