import { Injectable, Logger, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm'; 
import { User, Role, Task } from '@task-mgnt-workspace/data'; 
import { OrganizationService } from '../organizations/organizations.service'; 
import { UpdateUserDto } from './dto/update-user.dto'; 
import * as bcrypt from 'bcryptjs';

type RequestUser = { id: number, roleId: number, organizationId: number, permissions: string[] };

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Task) 
    private taskRepository: Repository<Task>,
    private readonly organizationService: OrganizationService, 
  ) {}

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ 
        where: { username },
        relations: ['role', 'role.permissions'] 
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

  private async getAccessScope(user: RequestUser): Promise<FindOptionsWhere<User> | FindOptionsWhere<User>[]> {
    if (user.roleId === 1) {
      return {}; 
    } 
    
    if (user.roleId === 2) { 
      const orgIds = await this.organizationService.findAllDescendantsIds(user.organizationId);
      return { organizationId: In(orgIds) }; 
    } 

    return { id: user.id }; 
  }

  async findAllScoped(user: RequestUser): Promise<User[]> {
    const scope = await this.getAccessScope(user);
    
    return this.usersRepo.find({ 
      where: scope,
      select: ['id', 'username', 'displayName', 'roleId', 'organizationId'],
      relations: ['organization', 'role']
    });
  }

  async findOneScoped(id: number, user: RequestUser): Promise<User | undefined> {
    const scope = await this.getAccessScope(user);
    
    const whereCondition = Array.isArray(scope) ? scope.map(s => ({ ...s, id })) : { ...scope, id };
    
    return this.usersRepo.findOne({ 
        where: whereCondition as FindOptionsWhere<User>,
        relations: ['organization', 'role']
    });
  }


async updateScoped(id: number, updateDto: UpdateUserDto, requestingUser: RequestUser): Promise<User | undefined> {
  const userToUpdate = await this.findOneScoped(id, requestingUser);

  if (!userToUpdate) {
    throw new NotFoundException(`User with ID ${id} not found or outside your management scope.`);
  }

  if (id === requestingUser.id && (updateDto.roleId || updateDto.organizationId)) {
    throw new ForbiddenException('You cannot update your own role or organization.');
  }

  if (requestingUser.roleId === 2 && userToUpdate.roleId === 1) {
    throw new ForbiddenException('Admins cannot modify the Owner account.');
  }
  
  let roleNeedsUpdate = false;

  if (updateDto.displayName !== undefined) {
      userToUpdate.displayName = updateDto.displayName;
  }
  if (updateDto.roleId !== undefined) {
      userToUpdate.roleId = updateDto.roleId;
      roleNeedsUpdate = true;
  }
  if (updateDto.organizationId !== undefined) {
      userToUpdate.organizationId = updateDto.organizationId;
  }
  
  
  if (roleNeedsUpdate) {
      const newRole = await this.roleRepo.findOneBy({ id: userToUpdate.roleId });
      if (newRole) {
          userToUpdate.roles = [newRole.name]; 
      }
  }

  const res = await this.usersRepo.save(userToUpdate);
  console.log('Updated user:', res);
  console.log(this.usersRepo.findOne({
    where: { id: userToUpdate.id },
    select: ['id', 'username', 'displayName', 'roleId', 'organizationId'], 
    relations: ['organization', 'role'] 
}));
  
  return this.usersRepo.findOne({
      where: { id: userToUpdate.id },
      select: ['id', 'username', 'displayName', 'roleId', 'organizationId'], 
      relations: ['organization', 'role'] 
  });
}

  async removeScoped(id: number, requestingUser: RequestUser): Promise<void> {
    const userToDelete = await this.findOneScoped(id, requestingUser);

    if (!userToDelete) {
      throw new NotFoundException(`User with ID ${id} not found or outside your management scope.`);
    }

    if (id === requestingUser.id) {
      throw new ForbiddenException('You cannot delete your own account.');
    }

    const taskCount = await this.taskRepository.count({ where: { ownerId: id } });
    if (taskCount > 0) {
      throw new ConflictException(`Cannot delete user with ID ${id}: They own ${taskCount} active tasks.`);
    }

    await this.usersRepo.remove(userToDelete);
  }
}