import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPermissions } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createPermission')
  async createPermission(
    @Body() body: { roleId: string; permissionData: UserPermissions },
  ) {
    return await this.userService.createPermission(
      body.roleId,
      body.permissionData,
    );
  }

  @Post('getPermissions')
  async getPermissions(@Body() body: { roleId: string }) {
    return await this.userService.getPermissions(body.roleId);
  }
}
