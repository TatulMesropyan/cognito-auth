import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { createHmac } from 'crypto';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import {
  ConfirmSignUpRequest,
  ConfirmSignUpResponse,
  DeleteUserCommand, InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authConfig: AuthConfig) {}
  private secretHash(name: string) {
    const hashier = createHmac('sha256', this.authConfig.clientSecret);
    hashier.update(`${name}${this.authConfig.clientId}`);
    return hashier.digest('base64');
  }
  public client = new CognitoIdentityProviderClient({
    region: this.authConfig.region,
    credentials: fromCognitoIdentityPool({
      clientConfig: {
        region: this.authConfig.region,
      },
      identityPoolId: this.authConfig.userPoolId,
    }),
  });

  async signUp(signUpCredentials: SignUpDto) {
    const { name, password, email } = signUpCredentials;
    try {
      const command = new SignUpCommand({
        ClientId: this.authConfig.clientId,
        Username: name,
        Password: password,
        SecretHash: this.secretHash(name),
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
        ],
      });
      const res = await this.client.send(command);
      console.log(res);
      return 'User created Successfully';
    } catch (e) {
      return e.message;
    }
  }

  async confirmWithEmailCode(name: string, confirmationCode: string) {
    try {
      const input: ConfirmSignUpRequest = {
        ClientId: this.authConfig.clientId,
        Username: name,
        SecretHash: this.secretHash(name),
        ConfirmationCode: confirmationCode,
      };
      const config = new ConfirmSignUpCommand(input);
      const response: ConfirmSignUpResponse = await this.client.send(config);
      console.log(response);
      return 'User confirmed succesfully';
    } catch (e) {
      throw e.message;
    }
  }

  async deleteAccount(credentials: SignUpDto) {
    try {
      const authCommand = new InitiateAuthCommand(this.client);
      const res = await this.client.send(command);
      console.log(res);
      // const command = new DeleteUserCommand({ AccessToken: accessToken });
    } catch (e) {
      return e.message;
    }
  }
  async signIn(signInCredentials: {
    name: string;
    password: string;
    email?: string;
  }) {
    const command = new SignUpCommand({
      ClientId: this.authConfig.clientId,
      Username: signInCredentials.name,
      Password: signInCredentials.password,
      SecretHash: this.secretHash(signInCredentials.name),
      UserAttributes: [
        {
          Name: 'email',
          Value: signInCredentials.email,
        },
      ],
    });
    await this.client.send(command);
  }
}
