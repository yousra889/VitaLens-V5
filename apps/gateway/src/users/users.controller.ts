import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import '../auth/types/jwt-payload.type'; // module augmentation for Request.user

@Controller('user')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request) {
    return request.user;
  }
}
