import { Controller, Post, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) // 👈 Protect the route with the access token
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(
      createUserDto.username,
      createUserDto.password,
      createUserDto.roleId,
      createUserDto.organizationId,
      createUserDto.displayName,
    );
    
    // Strip the password hash before returning the new user object
    const { password, ...result } = newUser;
    return result; 
  }
}