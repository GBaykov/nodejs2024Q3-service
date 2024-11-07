import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto {
//   oldPassword: string; // previous password
//   newPassword: string;
// }

export class UpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string;
}
