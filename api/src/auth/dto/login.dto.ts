import { IsString, IsEmail } from 'class-validator';

export class LoginInputDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginOutputDto {
  access_token: string;
}
