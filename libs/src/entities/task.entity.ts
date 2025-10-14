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

  @Column({ default: 'open' })
  status!: string; // e.g., 'open', 'in-progress', 'done'

  // Foreign Key for Owner/Creator
  @Column()
  ownerId!: number;

  // Relations: Task is owned by one User
  @ManyToOne(() => User, user => user.ownedTasks)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  // Foreign Key for Organization (to enforce org-level access)
  @Column()
  organizationId!: number;

  // Relations: Task belongs to one Organization
  @ManyToOne(() => Organization, org => org.tasks)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}