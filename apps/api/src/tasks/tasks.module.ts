import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@task-mgnt-workspace/data';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module'; 
import { UsersModule } from '../users/users.module'; 
import { AuditLogModule } from '../audit-log/audit-log.module';
import { OrganizationModule } from '../organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule, 
    UsersModule, 
    AuditLogModule,
    OrganizationModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}