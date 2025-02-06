import { Injectable } from '@nestjs/common';
import { PermissionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createPermission(roleId: string, permissionData) {
    return await this.prisma.userPermissions.create({
      data: {
        name: permissionData.name,
        label: permissionData.label,
        type:
          permissionData.type == 0
            ? PermissionType.CATALOGUE
            : permissionData.type == 1
              ? PermissionType.MENU
              : PermissionType.BUTTON,
        route: permissionData.route,
        order: permissionData.order,
        icon: permissionData.icon,
        component: permissionData.component,
        hideInMenu: permissionData.hideInMenu,
        hide: permissionData.hide,
        roles: {
          create: {
            roleId: roleId,
          },
        },
      },
    });
  }
}
