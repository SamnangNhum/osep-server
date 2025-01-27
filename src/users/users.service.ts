import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { lastValueFrom } from 'rxjs';
import * as cuid from 'cuid';

@Injectable()
export class UsersService {
  username: string = '';
  password: string = '';
  hashPassword: string = '';
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async getUsers(): Promise<any> {
    const userData = await lastValueFrom(this.httpService.get('/users'));
    return userData.data.users;
  }

  async hashedPasswords(): Promise<void> {
    const saltOrRounds = 10;
    const password = this.password;
    try {
      this.hashPassword = await hash(password, saltOrRounds);
    } catch (err) {
      throw err;
    }
  }
  // Register Function
  async insertIntoDB(registerDto): Promise<void> {
    this.username = registerDto.username;
    this.password = registerDto.password;
    try {
      await this.hashedPasswords();
    } catch {
      throw {
        message: 'Error Hashing Password',
      };
    }

    const userData = {
      id: cuid(),
      email: this.username,
      password: this.hashPassword,
    };

    try {
      await lastValueFrom(this.httpService.post('/user/register', userData));
    } catch (e) {
      throw {
        message: 'User Duplicated',
      };
    }
  }
  ////////////////////////////////////////////////////////////////

  async LoginValidated(getAllUsers): Promise<{}> {
    let matchUsername = '';
    let matchPassword = '';
    let user = [];

    const findUsername: object[] = getAllUsers.filter(
      (value: any) => value['email'] === this.username,
    );

    try {
      if (findUsername.length != 0) {
        matchUsername = findUsername[0]['email'];
      } else {
        throw {
          message: 'User does not exist',
        };
      }
    } catch (e) {
      throw e;
    }

    try {
      if (await compare(this.password, findUsername[0]['password'])) {
        matchPassword = findUsername[0]['password'];
      } else {
        throw {
          message: 'Username and password is incorrect',
        };
      }
    } catch (e) {
      throw e;
    }

    return {
      email: matchUsername,
      password: matchPassword,
    };
  }

  async getGenerateToken(loginDto): Promise<{ success:boolean , access_token: string }> {
    this.username = loginDto.username;
    this.password = loginDto.password;

    let signToken: string = '';

    let getAllUsers: object[] = [];

    try {
      await this.getUsers();
      getAllUsers = await this.getUsers();
    } catch (e) {
      throw e;
    }

    let user = {};
    try {
      user = await this.LoginValidated(getAllUsers);
    } catch (e) {
      throw e;
    }

    const payload = user;
    try {
      signToken = this.jwtService.sign(payload);
    } catch {
      throw 'Error Signing';
    }

    return {
      success:true,
      access_token: signToken,
    };
  }
}
