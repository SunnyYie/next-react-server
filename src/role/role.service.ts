import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { }

  async getRoles() {
    return this.prisma.role.findMany();
  }

  async createRole(data: any) {
    return this.prisma.role.create({ data });
  }
}
