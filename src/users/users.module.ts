import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigModule } from 'src/config/config.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  controllers: [UsersController],
  imports:[MyConfigModule ,  JwtModule.register({
    secret: 'my-secret-no-want-can-hack',
    signOptions:{expiresIn:3600}
   
  }),],
  providers: [UsersService]
})
export class UsersModule {}
