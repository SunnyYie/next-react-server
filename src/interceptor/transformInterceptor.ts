import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = {
          status: 0, // 默认成功
          data: data,
          message: '成功',
        };

        // 根据不同的情况设置 status 和 message
        if (data === null || data === undefined) {
          response.status = -1;
          response.message = '失败';
        }

        // 你可以根据业务逻辑进一步调整 status 和 message
        // 例如，如果 data 中包含特定的错误信息，可以设置 status 为 -1

        return response;
      }),
    );
  }
}
