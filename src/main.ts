import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AllExceptionsFilter } from './filters/exeptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalGuards(
    new (class extends JwtAuthGuard {
      canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { url } = request;
        if (url === '/' || url.startsWith('/auth/') || url.startsWith('/doc')) {
          return true;
        }
        return super.canActivate(context);
      }
    })(),
  );
  await app.listen(4000);

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Unhandled Rejection at: ${promise}: ${reason}`);
  });
  process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error.message}`, error.stack);
  });
}
bootstrap();
