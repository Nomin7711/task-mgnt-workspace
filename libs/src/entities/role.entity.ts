import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

// Defines the role structure (Owner, Admin, Viewer)
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  // Role name (e.g., 'Owner', 'Admin', 'Viewer')
  @Column({ unique: true })
  name!: string;

  // Relations: One role can be held by many users
  @OneToMany(() => User, user => user.role)
  users!: User[];

  // Relations: One role has many permissions
  @OneToMany(() => Permission, permission => permission.role)
  permissions!: Permission[];
}