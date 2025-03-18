import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { KeycloakAuthGuard } from './keycloak-auth-guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, KeycloakAuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
