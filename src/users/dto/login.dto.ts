import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  static password(password: any, password1: string) {
    throw new Error('Method not implemented.');
  }
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
