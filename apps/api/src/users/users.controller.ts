import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    HttpStatus, 
    HttpCode, 
    ConflictException,
    Get,
    Put,
    Delete,
    Param,
    Req,
    NotFoundException
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { PermissionGuard } from '../common/guards/permission.guard';
  import { RequirePermission } from '../common/decorators/require-permission.decorator';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  type RequestUser = { id: number, roleId: number, organizationId: number, permissions: string[] }; 
  type RequestWithUser = Request & { user: RequestUser };
  
  
  @Controller('users')
  @UseGuards(JwtAuthGuard, PermissionGuard) 
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @RequirePermission('user:manage') 
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
  
    @Get()
    @RequirePermission('user:manage') 
    async findAll(@Req() req: RequestWithUser) {
      return this.usersService.findAllScoped(req.user);
    }
    @Get(':id')
    @RequirePermission('user:manage')
    async findOne(@Param('id') id: number, @Req() req: RequestWithUser) {
      const user = await this.usersService.findOneScoped(id, req.user);
      if (!user) {
          throw new NotFoundException(`User with ID ${id} not found or outside your scope.`);
      }
      const { password, ...result } = user;
      return result;
    }
    
    @Put(':id')
    @RequirePermission('user:manage')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
      const updatedUser = await this.usersService.updateScoped(id, updateUserDto, req.user);
      if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found or outside your scope.`);
      }
      const { password, ...result } = updatedUser;
      return result;
    }
  
    @Delete(':id')
    @RequirePermission('user:manage')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
      await this.usersService.removeScoped(id, req.user);
    }
  }