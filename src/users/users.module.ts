import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from "../common/common.module";

@Module({
  controllers: [UsersController],
  imports: [
    CommonModule
  ],
  providers: [
    UsersService,

  ],
  exports: [UsersService]
})
export class UsersModule {}
