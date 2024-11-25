import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  public login: string;

  @IsString()
  public password: string;
}
