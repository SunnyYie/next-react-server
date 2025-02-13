import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, Roles } from 'src/decorator/roles.decorator';
import { PermissionKeys, UserPermissions } from '@prisma/client';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/roles.guard';

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

  @Get('getPermissionsAll')
  @Roles(Role.ADMIN, Role.admin)
  async getPermissionsAll() {
    return await this.userService.getPermissionsAll();
  }

  @Post('getPermissions')
  @Roles(Role.ADMIN, Role.admin)
  async getPermissions(@Body() body: { roleId: string }) {
    return await this.userService.getPermissions(body.roleId);
  }

  @Post('getPermissionsByCondition')
  async getPermissionsByCondition(@Body() body) {
    return await this.userService.getPermissionsByCondition(body);
  }

  @Put('updatePermission')
  // @Roles(Role.ADMIN)
  async updatePermission(
    @Body() body: { permissionId: string; permissionData: UserPermissions },
  ) {
    return await this.userService.updatePermissions(
      body.permissionId,
      body.permissionData,
    );
  }

  @Delete('deletePermission')
  // @Roles(Role.ADMIN)
  async deletePermission(@Body() body: { permissionId: string }) {
    return await this.userService.deletePermissions(body.permissionId);
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

  @Get('getPermissionKeysAll')
  async getPermissionKeysAll() {
    return await this.userService.getPermissionKeysAll();
  }

  @Post('getPermissionKeys')
  async getPermissionKeys(@Body() body: { roleId: string }) {
    return await this.userService.getPermissionKeys(body.roleId);
  }

  @Post('getPermissionKeysByCondition')
  async getPermissionKeysByCondition(@Body() body) {
    return await this.userService.getPermissionKeysByCondition(body);
  }

  @Put('updatePermissionKey')
  async updatePermissionKey(
    @Body()
    body: {
      permissionKeyId: string;
      permissionKeyData: PermissionKeys;
    },
  ) {
    return await this.userService.updatePermissionKeys(
      body.permissionKeyId,
      body.permissionKeyData,
    );
  }

  @Delete('deletePermissionKey')
  async deletePermissionKey(@Body() body: { permissionKeyId: string }) {
    return await this.userService.deletePermissionKeys(body.permissionKeyId);
  }

  @Post('createUser')
  async createUser(@Body() body: any) {
    return await this.userService.createUser(body);
  }

  @Get('getUsers')
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('getUsersByCondition')
  async getUsersByCondition(@Query() query: any) {
    return await this.userService.getUsersByCondition(query);
  }

  @Get('getUserDetail')
  async getUserDetail(@Query() query: { id: string }) {
    return await this.userService.getUserDetail(query.id);
  }

  @Put('updateUser')
  async updateUser(@Body() body: { id: string; userData: any }) {
    return await this.userService.updateUser(body.id, body.userData);
  }

  @Delete('deleteUser')
  async deleteUser(@Body() body: { id: string }) {
    return await this.userService.deleteUser(body.id);
  }
}
