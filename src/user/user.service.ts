import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  @InjectRepository(User)
  private usersRepository = this.dataSource.getRepository(User);

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save({
      ...createUserDto,
      version: 1,
    });

    return User.toResponce(user);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findByLogin(login: string) {
    const user = await this.usersRepository.findOneBy({ login });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return User.toResponce(user);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    let user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException();
    }
    user = {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
    };

    await this.usersRepository.save(user);
    return User.toResponce(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.usersRepository.softRemove(user);
  }
}
