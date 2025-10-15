import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Organization, org => org.children)
  @JoinColumn({ name: 'parentId' })
  parent?: Organization;

  @OneToMany(() => Organization, org => org.parent)
  children!: Organization[];
  
  @OneToMany(() => Task, task => task.organization)
  tasks!: Task[];

  @OneToMany(() => User, user => user.organization)
  users!: User[]; 
}