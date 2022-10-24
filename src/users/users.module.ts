import { Module } from '@nestjs/common';
import { MyConfigModule } from 'src/config/config.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports:[MyConfigModule],
  providers: [UsersService]
})
export class UsersModule {}
