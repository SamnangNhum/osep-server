import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/dto/login.dto';
import { response, Response } from 'express';
import { UsersService } from './users.service';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { registerDto } from 'src/dto/register.dto';

@ApiTags('User Endpoint')
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  @ApiExcludeEndpoint()
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
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'User Duplicated' })
  async createUser(
    @Res() response: Response,
    @Body() registerDto: registerDto,
  ): Promise<void> {
    try {
      await this.usersService.insertIntoDB(registerDto);
      response.status(201).end();
    } catch (e) {
      response.status(400).send(e);
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Response Access Token' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async loginUser(
    @Res() response: Response,
    @Body() loginDto: loginDto,
  ): Promise<void> {
    try {
      const token = await this.usersService.getGenerateToken(loginDto);
      response.status(200).send(token);
    } catch (e) {
      response.status(400).send(e);
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getUsers() {
    try {
      return this.usersService.getUsers()
    } catch {
      response.status(500).end();
    }
  }
}
