import { UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from "./auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body()
    signUpCredentials: {
      name: string;
      password: string;
      email: string;
    },
  ) {
    try {
      return await this.authService.signUp(signUpCredentials);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  @Post('confirmation')
  async confirmWithEmailCode(
    @Body()
    { name, confirmationCode }: { name: string; confirmationCode: string },
  ) {
    try {
      return await this.authService.confirmWithEmailCode(
        name,
        confirmationCode,
      );
    } catch (e) {
      throw new UserNotFoundException(e);
    }
  }
  @Post('signup')
  async signIn(
    @Body()
    signInCredentials: {
      name: string;
      password: string;
      email?: string;
    },
  ) {
    try {
      return await this.authService.signIn(signInCredentials);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  @Post('delete')
  async deleteAccount(@Body() credentials: SignUpDto) {
    try {
      return await this.authService.deleteAccount(credentials);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
