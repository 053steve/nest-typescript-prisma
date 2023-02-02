import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from "../common/common.module";
import { PrismaService } from '../common/services/prisma.service';
import { CognitoService } from '../common/services/cognito.service';


@Module({
  controllers: [UsersController],
  imports: [
    CommonModule
  ],
  providers: [
    UsersService,
    PrismaService,
  ],
  exports: [UsersService]
})
export class UsersModule {}
