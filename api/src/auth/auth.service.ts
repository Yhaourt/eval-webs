import { Injectable, UnauthorizedException } from '@nestjs/common';
import fetch from 'node-fetch';
import * as querystring from 'querystring';

@Injectable()
export class AuthService {
  private keycloakIntrospectionUrl = `${process.env.KEYCLOAK_URL}/realms/myrealm/protocol/openid-connect/token/introspect`;

  async validateToken(token: string): Promise<boolean> {
    const response = await fetch(this.keycloakIntrospectionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        token: token,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to validate token with Keycloak');
    }

    const data = await response.json();
    return data.active;
  }
}
