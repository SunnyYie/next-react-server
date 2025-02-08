import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { PermissionKeys, UserPermissions } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
// @UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createPermission')
  // @Roles(Role.ADMIN)
  async createPermission(
    @Body() body: { roleId: string; permissionData: UserPermissions[] },
  ) {
    return await this.userService.createPermissions(
      body.roleId,
      body.permissionData,
    );
  }

  @Post('getPermissions')
  // @Roles(Role.ADMIN, Role.USER)
  async getPermissions(@Body() body: { roleId: string }) {
    return await this.userService.getPermissions(body.roleId);
  }

  @Post('createPermissionKey')
  async createPermissionKey(
    @Body() body: { roleId: string; permissionKeyData: PermissionKeys[] },
  ) {
    return await this.userService.createPermissionKey(
      body.roleId,
      body.permissionKeyData,
    );
  }

  @Post('getPermissionKeys')
  async getPermissionKeys(@Body() body: { roleId: string }) {
    return await this.userService.getPermissionKeys(body.roleId);
  }
}
