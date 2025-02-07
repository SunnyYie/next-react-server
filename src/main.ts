import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transformInterceptor';
import { UnauthorizedExceptionFilter } from './filter/UnauthorizedExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 统一返回值格式
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常处理
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
