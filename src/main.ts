import { UnauthorizedExceptionFilter } from './filter/UnauthorizedExceptionFilter';
import { TransformInterceptor } from './interceptor/transformInterceptor';
import { LoggingInterceptor } from './interceptor/loggingInterceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 记录请求日志
  // app.useGlobalInterceptors(new LoggingInterceptor());

  // 统一返回值格式
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常处理
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
