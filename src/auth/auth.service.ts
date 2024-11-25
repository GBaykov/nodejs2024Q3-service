import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      return null;
    }

    if (user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    throw new NotFoundException(`${user.password}not equal ${pass}`);
    return null;
  }

  async login(user: LoginUserDto) {
    const payload = {
      password: user.password,

      login: user.login,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async createAdmin() {
    const isAdmin = await this.usersService.findByLogin('admin');
    if (!isAdmin) {
      const adminDTO = {
        login: 'admin',
        password: 'admin',
      };
      await this.usersService.create(adminDTO);
      return true;
    }
    return 'Hello World!-2.0';
  }
}
