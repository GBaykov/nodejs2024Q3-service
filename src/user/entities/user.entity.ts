export class User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number;

  static toResponce(user: User) {
    const { password, ...responce } = user;
    return responce;
  }
}
