import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "secret-key",
    });
  }

  async validate(payload: LoginUserDto) {
    return { login: payload.login, password: payload.password };
  }
}