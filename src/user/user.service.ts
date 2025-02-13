import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionType, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  // 获取全部权限
  async getPermissionsAll() {
    try {
      // 将角色字段添加到查询结果中
      const permissions = await this.prisma.userPermissions.findMany({
        include: {
          roles: true,
        },
      });
      return permissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  // 获取对应角色的权限
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

  // 条件查询权限
  async getPermissionsByCondition(condition: any) {
    try {
      const permissions = await this.prisma.userPermissions.findMany({
        where: condition,
        include: {
          roles: true,
        },
      });
      return permissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  // 更新权限
  async updatePermissions(permissionId: string, permissionData: any) {
    try {
      if (permissionData.roleId) {
        // 删除旧的权限与角色关联
        await this.prisma.rolePermission.deleteMany({
          where: { permissionId },
        });

        // 添加新的权限与角色关联
        await this.prisma.rolePermission.create({
          data: {
            roleId: permissionData.roleId,
            permissionId: permissionId,
          },
        });

        delete permissionData.roleId;
      }

      const permission = await this.prisma.userPermissions.update({
        where: { id: permissionId },
        data: {
          ...permissionData,
          type:
            permissionData.type == 0
              ? PermissionType.CATALOGUE
              : permissionData.type == 1
                ? PermissionType.MENU
                : PermissionType.BUTTON,
        },
      });
      return permission;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  }

  // 删除权限
  async deletePermissions(permissionId: string) {
    try {
      // 删除权限与角色的关联
      await this.prisma.rolePermission.deleteMany({
        where: { permissionId },
      });

      const res = await this.prisma.userPermissions.delete({
        where: { id: permissionId },
      });

      return res;
    } catch (error) {
      console.error('Error deleting permissions:', error);
      throw error;
    }
  }

  async createPermissionKey(roleId: string, permissionKeys: any[]) {
    const keys = await this.prisma.permissionKeys.createMany({
      data: permissionKeys.map((permissionKey) => ({
        label: permissionKey.label,
        name: permissionKey.name,
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

  // 获取全部权限标识
  async getPermissionKeysAll() {
    try {
      // 将角色字段添加到查询结果中
      const permissionKeys = await this.prisma.permissionKeys.findMany({
        include: {
          RolePermissionKeys: true,
        },
      });
      return permissionKeys;
    } catch (error) {
      console.error('Error fetching permissionKeys:', error);
      throw error;
    }
  }

  // 获取对应角色的权限标识
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

  // 条件查询权限标识
  async getPermissionKeysByCondition(condition: any) {
    try {
      const permissionKeys = await this.prisma.permissionKeys.findMany({
        where: {
          ...condition,
          name: {
            contains: condition.name,
          },
        },
        include: {
          RolePermissionKeys: true,
        },
      });
      return permissionKeys;
    } catch (error) {
      console.error('Error fetching permissionKeys:', error);
      throw error;
    }
  }

  // 更新权限标识
  async updatePermissionKeys(permissionKeyId: string, permissionKeyData: any) {
    try {
      if (permissionKeyData.roleId) {
        // 删除旧的权限与角色关联
        await this.prisma.rolePermissionKeys.deleteMany({
          where: { permissionKeyId },
        });

        // 添加新的权限与角色关联
        await this.prisma.rolePermissionKeys.create({
          data: {
            roleId: permissionKeyData.roleId,
            permissionKeyId: permissionKeyId,
          },
        });

        delete permissionKeyData.roleId;
      }

      const permissionKey = await this.prisma.permissionKeys.update({
        where: { id: permissionKeyId },
        data: permissionKeyData,
      });

      return permissionKey;
    } catch (error) {
      console.error('Error updating permissionKeys:', error);
      throw error;
    }
  }
  // 删除权限标识
  async deletePermissionKeys(permissionKeyId: string) {
    try {
      // 删除权限与角色的关联
      await this.prisma.rolePermissionKeys.deleteMany({
        where: { permissionKeyId },
      });

      const res = await this.prisma.permissionKeys.delete({
        where: { id: permissionKeyId },
      });

      return res;
    } catch (error) {
      console.error('Error deleting permissionKeys:', error);
      throw error;
    }
  }

  // 创建用户
  async createUser(userData: User) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          roleId: String(userData.roleId),
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // 获取全部用户
  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          role: true,
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // 获取用户详情
  async getUserDetail(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user detail:', error);
      throw error;
    }
  }

  // 条件查询用户
  async getUsersByCondition(condition: any) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          ...condition,
          email: {
            contains: condition.email,
          },
          name: {
            contains: condition.name,
          },
        },
        include: {
          role: true,
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // 更新用户
  async updateUser(userId: string, userData: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // 删除用户
  async deleteUser(userId: string) {
    try {
      const res = await this.prisma.user.delete({
        where: { id: userId },
      });
      return res;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
