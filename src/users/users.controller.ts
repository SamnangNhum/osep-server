import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('verify')
  async verifyFunction(@Res() response: Response) {
    const txt =
      'seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJ1bnRlIiwicGFzc3dvcmQiOiIwMTI1MjIxMjMiLCJpYXQiOjE2NjY3NzYyMjUsImV4cCI6MTY2Njc3OTgyNX0._oj5BbD5g17-Y9WhFr35IBRfoOBazlJwRfktLTxSIQI';
    try {
      await this.jwtService.verify(txt);
      response.status(200).end();
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        response.status(403).end();
      }, 5000);
    }
  }

  @Post('register')
  async createUser(
    @Res() response: Response,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    try {
      await this.usersService.insertIntoDB(username, password);

      response.status(200).send('USER REGISTERED');
    } catch (e) {
      response.status(400).send('USER DUPLICATED');
    }
  }

  @Post('login')
  async loginUser(
    @Res() response: Response,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    try {
      const token = await this.usersService.getGenerateToken(
        username,
        password,
      );
      response.status(200).send(token);
    } catch (e) {
      response.status(400).send(e + '');
    }
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
