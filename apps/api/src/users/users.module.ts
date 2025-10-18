import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role, Task} from '@task-mgnt-workspace/data'; 
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OrganizationModule } from '../organizations/organizations.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Task]), OrganizationModule], 
  controllers:[UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}