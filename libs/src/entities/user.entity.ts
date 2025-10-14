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

  // Storing roles as a JSON array (or array of strings) for simplicity
  @Column({ type: 'json', default: '[]' })
  roles!: string[]; 

  // --- Relations for RBAC and Hierarchy ---

  // Foreign Key to Organization
  @Column()
  organizationId!: number;

  // Relations: Many users belong to one organization (Hierarchy)
  @ManyToOne(() => Organization, org => org.users)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  // Foreign Key to Role
  @Column()
  roleId!: number;

  // Relations: Many users hold one primary role (RBAC)
  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  // Relations: One user can own many Tasks (Ownership)
  @OneToMany(() => Task, task => task.owner)
  ownedTasks!: Task[];
}
