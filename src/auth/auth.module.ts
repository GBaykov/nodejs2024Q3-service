import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('TOKEN_EXPIRE_TIME') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
