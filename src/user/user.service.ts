import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { DB } from 'src/database/db';
import { isUUID } from 'class-validator';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      id: uuid(),
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    await DB.users.push(user);
    return User.toResponce(user);
  }

  async findAll() {
    const users = await DB.users;
    return users;
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const user = await DB.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let userIndex;
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const user = await DB.users.find((user, index) => {
      userIndex = index;
      return user.id === id;
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException();
    }
    const newUser = {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
    };
    await DB.users.splice(userIndex, 1, newUser);
    return User.toResponce(newUser);
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const userIndex = await DB.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException();
    }
    DB.users.splice(userIndex, 1);
  }
}
