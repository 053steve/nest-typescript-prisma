import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CognitoAuthGuard } from '../auth/cognito.guard';
import { UserDto } from "./dto/user.dto";
import { Prisma } from '@prisma/client';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @HttpCode(201)
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(200)
  async findAll() {
    const users = await this.usersService.findAll({});
    return users.map(it => new UserDto(it));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':email')
  @HttpCode(200)
  findOne(@Param('email') email: string) {
    return this.usersService.findByUserEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':email')
  @HttpCode(200)
  update(@Param('email') email: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.adminUpdate({where: {email: email}, data: updateUserDto});
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':email')
  @HttpCode(200)
  remove(@Param('email') email: string) {
    return this.usersService.remove({email});
  }
}
