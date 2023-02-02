import { Injectable, Inject } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserInput } from "../auth/auth.interface";
import { CognitoService } from "../common/services/cognito.service";
import { handleExceptions } from "../common/utils/exceptionHandler";
import { PrismaService } from '../common/services/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(
    private cognitoService: CognitoService,
    private prismaService: PrismaService
  ) {
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  findByUserEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findByUserId(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findUserBySub(sub: string) {
    return this.prismaService.user.findFirst({ where: { sub } });
  }

  async adminUpdate(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {

    try {
      const { where, data } = params;
      const { email } = where;
      await this.cognitoService.adminUpdateUserAttributes(email, data);
      return this.prismaService.user.update({
        data,
        where,
      });  
    } catch (err) {
      handleExceptions(err);
    }
    
  }

  async updateByEmail(params: {
    email: string;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    try {
      const { email, data } = params;
      const where: Prisma.UserWhereUniqueInput = {
        email
      }

      return this.prismaService.user.update({
        data,
        where,
      });

    } catch (err) {
      handleExceptions(err);
    }
  }


  async remove(where: Prisma.UserWhereUniqueInput) {
    const {email} = where;
    await this.cognitoService.adminDeleteUser(email);
    return this.prismaService.user.delete({
        where
    });
  }
}
