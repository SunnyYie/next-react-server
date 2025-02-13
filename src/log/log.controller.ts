import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  // 获取接口日志
  @Get('getInterfaceLogs')
  async getInterfaceLogs() {
    return this.logService.getInterfaceLogs();
  }

  // 条件查询
  @Get('getInterfaceLogsByCondition')
  async getInterfaceLogsByCondition(condition: any) {
    return this.logService.getInterfaceLogsByCondition(condition);
  }

  // 删除对应日志
  @Get('deleteInterfaceLog')
  async deleteInterfaceLog(logId: string) {
    return this.logService.deleteInterfaceLog(logId);
  }
}
