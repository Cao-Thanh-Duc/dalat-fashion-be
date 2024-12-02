import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { FileUploadService } from 'src/lib/file-upload.service';
import { UpdateUserDto, UserFilterType } from 'src/modules/user/dto/user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async getAll(filters: UserFilterType): Promise<any> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const where: Prisma.UsersWhereInput = search
      ? {
          OR: [
            { UserName: { contains: search, mode: 'insensitive' } },
            { Email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const users = await this.prismaService.users.findMany({
      where,
      skip,
      take: items_per_page,
      select: {
        UserID: true,
        Email: true,
        UserName: true,
      },
    });

    const totalUsers = await this.prismaService.users.count({ where });

    return {
      data: users,
      total: totalUsers,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: string): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { UserID: Number(id) },
      select: {
        UserID: true,
        Email: true,
        UserName: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async updateMeUser(data: UpdateUserDto, id: string): Promise<Users> {
    return await this.prismaService.users.update({
      where: {
        UserID: Number(id),
      },
      data: {
        Email: data.Email,
        UserName: data.UserName,
        // map other fields as necessary
      },
    });
  }

  async updateUserRole(
    userId: string, // ID của người dùng cần cập nhật
    roleId: string,
    currentUserId: string, // ID của người dùng hiện tại
  ): Promise<Users> {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot update your own role.');
    }

    const role = await this.prismaService.roles.findUnique({
      where: { RoleID: Number(roleId) },
    });

    if (!role) {
      throw new HttpException(
        { message: 'Role not found.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.prismaService.users.update({
      where: { UserID: Number(userId) },
      data: { RoleID: Number(roleId) },
    });
  }

  async deleteUser(
    userId: string,
    currentUserId: string,
  ): Promise<{ message: string }> {
    if (userId === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account.');
    }

    const user = await this.prismaService.users.findUnique({
      where: { UserID: Number(userId) },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prismaService.users.delete({
      where: { UserID: Number(userId) },
    });

    return { message: 'User deleted successfully' };
  }

  async getCountUser(): Promise<{ data: { total: number } }> {
    const totalUsers = await this.prismaService.users.count();
    return { data: { total: totalUsers } };
  }
}
