import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config()


@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.BASE_URL,
      headers: {
        [process.env.HEADER_NAME]:
          process.env.X_HASURA_ADMIN_SECRET,
      },
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [
    HttpModule.register({
        baseURL: process.env.BASE_URL,
        headers: {
          [process.env.HEADER_NAME]:
            process.env.X_HASURA_ADMIN_SECRET,
        },
        timeout: 5000,
        maxRedirects: 5,
      }),
  ],
})
export class MyConfigModule {
  constructor() {}
}
