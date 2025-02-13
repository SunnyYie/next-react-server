import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogService implements OnModuleDestroy {
  private logBuffer: any[] = [];
  private readonly bufferSize = 100; // 批量插入的大小
  private readonly flushInterval = 5000; // 定期插入的时间间隔（毫秒）
  private flushTimer: NodeJS.Timeout;

  constructor(private readonly prisma: PrismaService) {
    this.startFlushTimer();
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => this.flushLogs(), this.flushInterval);
  }

  private async flushLogs() {
    if (this.logBuffer.length > 0) {
      const logsToInsert = this.logBuffer.splice(0, this.bufferSize);
      await this.prisma.interfaceLog.createMany({ data: logsToInsert });
    }
  }

  // 创建接口日志
  async createInterfaceLog(log: any) {
    this.logBuffer.push(log);
    if (this.logBuffer.length >= this.bufferSize) {
      await this.flushLogs();
    }
  }

  // 获取接口日志
  async getInterfaceLogs() {
    return this.prisma.interfaceLog.findMany();
  }

  // 条件查询
  async getInterfaceLogsByCondition(condition: any) {
    return this.prisma.interfaceLog.findMany({
      where: {
        ...condition,
        url: {
          contains: condition.url,
        },
        referer: {
          contains: condition.referer,
        }
      },
    });
  }

  // 删除对应日志
  async deleteInterfaceLog(logId: string) {
    return this.prisma.interfaceLog.delete({ where: { id: logId } });
  }

  onModuleDestroy() {
    clearInterval(this.flushTimer);
    this.flushLogs();
  }
}
