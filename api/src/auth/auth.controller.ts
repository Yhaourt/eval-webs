import { Controller, Post, Body } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('sign-in')
  async login(@Body() data: SignInDto) {}
}
