import { IsEmail, IsEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmpty()
  @IsString()
  @MinLength(8)
  password: string;
  @IsEmpty()
  @IsString()
  name: string;
  @IsEmail()
  email: string;
}
