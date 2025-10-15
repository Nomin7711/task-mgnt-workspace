import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuditLog } from '@task-mgnt-workspace/data';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
    AuthModule, 
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService], 
})
export class AuditLogModule {}