import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@task-mgnt-workspace/data';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async recordAction(userId: number, action: string, details?: Record<string, any>): Promise<void> {
    const log = this.auditLogRepository.create({
      userId,
      action,
      details: details ? JSON.stringify(details) : null,
    });
    await this.auditLogRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({ order: { timestamp: 'DESC' } });
  }
}