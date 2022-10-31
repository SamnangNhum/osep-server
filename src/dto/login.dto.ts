import { ApiProperty } from '@nestjs/swagger';

export class loginDto{
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}