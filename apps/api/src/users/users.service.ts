import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '@task-mgnt-workspace/data';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>, 
  ) {}

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ 
        where: { username }
    });
  }

  async findById(id: number, loadPermissions = false): Promise<User | undefined> {
    const relations = loadPermissions 
        ? ['role', 'role.permissions'] 
        : ['role']; 

    return this.usersRepo.findOne({ 
        where: { id },
        relations: relations 
    });
}
  async createUser(
    username: string, 
    password: string, 
    roleId: number, 
    organizationId: number,
    displayName?: string
  ) {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);
    
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    const rolesArray = role ? [role.name] : []; 

    const user = this.usersRepo.create({ 
        username, 
        password: hash, 
        displayName,
        roleId, 
        organizationId,
        roles: rolesArray 
    });
    
    this.logger.log(`Created user ${username} with roleId ${roleId}`);
    return this.usersRepo.save(user);
  }

  async validatePassword(user: User, plain: string) {
    return bcrypt.compare(plain, user.password);
  }
}