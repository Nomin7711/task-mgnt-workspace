import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { SeederModule } from '../seeder/seeder.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import {
  Organization,
    Permission,
    Role,
    Task,
    User
  } from '@task-mgnt-workspace/data'; 

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SeederModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'mysecret123',     
        signOptions: { expiresIn: 3600 }, 
      }),
    TypeOrmModule.forFeature([User, Organization, Role, Permission, Task]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
