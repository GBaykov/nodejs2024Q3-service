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
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  @InjectRepository(User)
  private usersRepository = this.dataSource.getRepository(User);

  async create(createUserDto: CreateUserDto) {
    // if (!createUserDto.login || !createUserDto.password) {
    //   throw new BadRequestException();
    // }

    // const user: User = {
    //   ...createUserDto,
    //   id: uuid(),
    //   version: 1,
    //   createdAt: new Date().getTime(),
    //   updatedAt: new Date().getTime(),
    // };
    // await DB.users.push(user);
    const user = await this.usersRepository.save({
      ...createUserDto,
      version: 1,
    });

    return User.toResponce(user);
  }

  async findAll() {
    return await this.usersRepository.find();
    // const users = await DB.users;
    // return users.map((user) => User.toResponce(user));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    // if (!user) return undefined;
    return User.toResponce(user);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    // let userIndex;
    // if (
    //   !isUUID(id) ||
    //   !updatePasswordDto.newPassword ||
    //   !updatePasswordDto.oldPassword
    // ) {
    //   throw new BadRequestException();
    // }
    let user = await this.usersRepository.findOneBy({ id });
    // if (!user) return undefined;

    // const user = await DB.users.find((user, index) => {
    //   userIndex = index;
    //   return user.id === id;
    // });
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
    // await DB.users.splice(userIndex, 1, newUser);
    await this.usersRepository.save(user);
    return User.toResponce(user);
  }

  async remove(id: string) {
    // if (!isUUID(id)) {
    //   throw new BadRequestException();
    // }
    // const userIndex = await DB.users.findIndex((user) => user.id === id);
    // if (userIndex === -1) {
    //   throw new NotFoundException();
    // }
    // DB.users.splice(userIndex, 1);
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.usersRepository.softRemove(user);
  }
}
