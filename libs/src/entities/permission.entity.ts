import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
@Unique(['action', 'roleId'])
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() 
  action!: string; 

  @Column()
  roleId!: number;

  @ManyToOne(() => Role, role => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role!: Role;
}