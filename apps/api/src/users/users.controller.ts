import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    HttpStatus, 
    HttpCode, 
    ConflictException 
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { CreateUserDto } from './dto/create-user.dto';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
      
      const existingUser = await this.usersService.findByUsername(createUserDto.username);
  
      if (existingUser) {
        throw new ConflictException(`User with username '${createUserDto.username}' already exists.`);
      }
  
      const newUser = await this.usersService.createUser(
        createUserDto.username,
        createUserDto.password,
        createUserDto.roleId,
        createUserDto.organizationId,
        createUserDto.displayName,
      );
      
      const { password, ...result } = newUser;
      return result; 
    }
  }