import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from '../tasks/tasks.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuditLog } from '@task-mgnt-workspace/data';
import { OrganizationModule } from '../organizations/organizations.module';
import {
  User,
  Organization,
  Role,
  Permission,
  Task,
} from '@task-mgnt-workspace/data'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',                       
      database: 'data/sqlite.db',           
      entities: [User, Organization, Role, Permission, Task, AuditLog],
      synchronize: true,                    
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    AuditLogModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

