import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string; 

  @Column({ nullable: true })
  displayName?: string;

  @Column({ type: 'json', default: '[]' })
  roles!: string[]; 

  @Column()
  organizationId!: number;

  @ManyToOne(() => Organization, org => org.users)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column()
  roleId!: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @OneToMany(() => Task, task => task.owner)
  ownedTasks!: Task[];
}
