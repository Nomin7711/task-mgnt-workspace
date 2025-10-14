import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  // 2-level Hierarchy: Self-referencing relationship for parent/child organization
  @Column({ nullable: true })
  parentId?: number;

  // Relation to Parent (Many organizations can belong to one parent)
  @ManyToOne(() => Organization, org => org.children)
  @JoinColumn({ name: 'parentId' })
  parent!: Organization;

  // Relation to Children (One organization can have many children)
  @OneToMany(() => Organization, org => org.parent)
  children!: Organization[];

  // Relation to Users
  @OneToMany(() => User, user => user.organization)
  users!: User[];

  // Relation to Tasks
  @OneToMany(() => Task, task => task.organization)
  tasks!: Task[];
}