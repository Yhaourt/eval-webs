import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginInputDto, LoginOutputDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as querystring from 'node:querystring';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() data: LoginInputDto): Promise<LoginOutputDto> {
    const { email, password } = data;

    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          grant_type: 'password',
          username: email,
          password: password,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }

    return (await response.json()) as LoginOutputDto;
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const { email, password, username, firstName, lastName } = data;

    try {
      const adminTokenResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: querystring.stringify({
            client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
            // client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'password',
            username: process.env.KEYCLOAK_ADMIN_USERNAME,
            password: process.env.KEYCLOAK_ADMIN_PASSWORD,
          }),
        },
      );
      console.log(adminTokenResponse);

      if (!adminTokenResponse.ok) {
        throw new Error('Failed to obtain admin token');
      }

      const adminToken = await adminTokenResponse.json();

      // Créer l'utilisateur dans Keycloak
      const userResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken.access_token}`,
          },
          body: JSON.stringify({
            username,
            email,
            firstName,
            lastName,
            enabled: true,
            credentials: [
              {
                type: 'password',
                value: password,
                temporary: false,
              },
            ],
          }),
        },
      );

      if (!userResponse.ok) {
        throw new Error('Failed to create user');
      }

      const createdUser = await userResponse.json();
      return createdUser;
    } catch (error) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }
}
