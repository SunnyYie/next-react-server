import { Injectable } from '@nestjs/common';
import { PermissionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createPermissions(roleId: string, permissionsData: any[]) {
    const permissioms = await this.prisma.userPermissions.createMany({
      data: permissionsData.map((permission) => ({
        ...permission,
        type:
          permission.type == 0
            ? PermissionType.CATALOGUE
            : permission.type == 1
              ? PermissionType.MENU
              : PermissionType.BUTTON,
      })),
    });

    // 获取创建的权限 ID
    const permissionIds = await this.prisma.userPermissions.findMany({
      where: {
        name: {
          in: permissionsData.map((p) => p.name),
        },
      },
      select: {
        id: true,
      },
    });

    // 第二步：批量创建权限与角色的关联
    const permissionRoleRelations = permissionIds.map((permission) => ({
      roleId: roleId,
      permissionId: permission.id,
    }));

    await this.prisma.rolePermission.createMany({
      data: permissionRoleRelations,
    });

    return permissioms;
  }

  async getPermissions(roleId: string) {
    try {
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId },
        include: {
          permission: true,
        },
      });

      const permissions = rolePermissions.map((rp) => rp.permission);
      return permissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  async createPermissionKey(roleId: string, permissionKeys: any[]) {
    const keys = await this.prisma.permissionKeys.createMany({
      data: permissionKeys.map((permissionKey) => ({
        label: permissionKey.label,
      })),
    });

    // 获取创建的权限 ID
    const permissionKeyIds = await this.prisma.permissionKeys.findMany({
      where: {
        label: {
          in: permissionKeys.map((p) => p.label),
        },
      },
      select: {
        id: true,
      },
    });

    // 第二步：批量创建权限与角色的关联
    const permissionRoleRelations = permissionKeyIds.map((permission) => ({
      roleId: roleId,
      permissionKeyId: permission.id,
    }));

    await this.prisma.rolePermissionKeys.createMany({
      data: permissionRoleRelations,
    });

    return keys;
  }

  async getPermissionKeys(roleId: string) {
    try {
      const rolePermissionKeys = await this.prisma.rolePermissionKeys.findMany({
        where: { roleId },
        include: {
          permissionKey: true,
        },
      });

      const permissions = rolePermissionKeys.map((rp) => rp.permissionKey);
      return permissions;
    } catch (error) {
      console.error('Error fetching permissionKeys:', error);
      throw error;
    }
  }
}
