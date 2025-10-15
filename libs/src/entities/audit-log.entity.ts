import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; 

  @Column()
  action!: string; 

  @Column({ type: 'text', nullable: true })
  details?: string; 

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;
}