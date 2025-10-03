import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(dto);
    return res.status(201).json(user);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.setHeader('Set-Cookie', this.authService.getCookieForToken(token));
    return res.json(user);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.setHeader(
      'Set-Cookie',
      'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
    );
    return res.status(200).json({ ok: true });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
