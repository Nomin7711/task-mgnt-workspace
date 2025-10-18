// src/tasks/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ default: 'To Do' })
  status!: string;

  @Column({ default: 'Work' })
  category!: string;

  @Column({ default: 'Medium' })
  priority!: string;

  @Column()
  ownerId!: number;

  @ManyToOne(() => User, user => user.ownedTasks)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column()
  organizationId!: number;

  @ManyToOne(() => Organization, org => org.tasks)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}

