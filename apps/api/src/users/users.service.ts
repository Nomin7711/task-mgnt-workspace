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
    // Inject Role repo to look up role names during user creation
    @InjectRepository(Role)
    private roleRepo: Repository<Role>, 
  ) {}

  async findByUsername(username: string) {
    // Select the password explicitly and include relations for auth/context
    return this.usersRepo.findOne({ 
        where: { username }, 
        relations: ['role', 'organization'] 
    });
  }

  async findById(id: number) {
    return this.usersRepo.findOne({ 
        where: { id },
        relations: ['role', 'organization'] 
    });
  }

  /**
   * Creates a new user with required foreign keys.
   */
  async createUser(
    username: string, 
    password: string, 
    roleId: number, 
    organizationId: number,
    displayName?: string
  ) {
    // Use environment variable for salt rounds, default to 10
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);
    
    // Fetch the role to populate the 'roles' array column (e.g., ['Owner'])
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    const rolesArray = role ? [role.name] : []; // Store the role name in the JSON column

    const user = this.usersRepo.create({ 
        username, 
        password: hash, 
        displayName,
        roleId, 
        organizationId,
        roles: rolesArray // Save the role name to the roles JSON column for easy lookup
    });
    
    this.logger.log(`Created user ${username} with roleId ${roleId}`);
    return this.usersRepo.save(user);
  }

  async validatePassword(user: User, plain: string) {
    // Compares the plaintext password against the stored hash
    return bcrypt.compare(plain, user.password);
  }
}