import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from 'src/log/log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: LogService,
    private jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();

    // 将请求信息存入日志表中

    return next.handle().pipe(
      tap(() => {
        const log = {} as any;

        log.method = request.method;
        log.url = request.url;
        log.ip = request.ip;
        //浏览器信息
        log.userAgent = request.headers['user-agent'];
        log.referer = request.headers['referer'];
        log.status = response.statusCode;
        log.os = request.headers['sec-ch-ua-platform'];
        log.params = JSON.stringify({
          ...request.query,
          ...request.params,
          ...request.body,
        });

        const authHeader = request.headers['authorization'];
        if (authHeader) {
          const [type, token] = authHeader.split(' ');
          const user = this.jwtService.verify(token);
          log.userId = user.sub;
        }
        try {
          // todo:存入redis，批量插入
          this.logService.createInterfaceLog(log);
        } catch (error) {
          throw new Error(error);
        }
      }),
    );
  }
}
