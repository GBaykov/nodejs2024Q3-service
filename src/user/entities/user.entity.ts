import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  version: number; // integer number, increments on update

  @CreateDateColumn()
  createdAt: number; // timestamp of creation

  @UpdateDateColumn()
  updatedAt: number;

  static toResponce(user: User) {
    const { password, ...responce } = user;
    return responce;
  }
}
