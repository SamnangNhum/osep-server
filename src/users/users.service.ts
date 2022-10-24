import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';
@Injectable()
export class UsersService {

    constructor(private httpService: HttpService ){
        
    }

    async getUsers(): Promise<any> {
        const userData = await lastValueFrom(this.httpService.get('/user' ))
        return userData.data.users
    }
}
