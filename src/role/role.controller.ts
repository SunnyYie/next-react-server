import { Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('getRoles')
  async getRoles() {
    return this.roleService.getRoles();
  }

  @Post('createRole')
  async createRole(data: any) {
    return this.roleService.createRole(data);
  }
}
