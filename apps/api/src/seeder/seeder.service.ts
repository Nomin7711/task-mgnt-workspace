import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, Role, Permission } from '@task-mgnt-workspace/data';
import { UsersService } from '../users/users.service';

// --- Default Data Definitions ---

const DEFAULT_ORG_NAME = 'Corporate Headquarters';
const DEFAULT_USER_DATA = {
    username: 'superadmin',
    password: 'adminpassword123',
    displayName: 'System Owner'
};

const ROLE_PERMISSIONS: { [key: string]: string[] } = {
  Owner: [
    'task:create', 'task:read', 'task:update', 'task:delete', 
    'user:manage', 'org:manage', 'log:read', 'audit:read'
  ],
  Admin: [
    'task:create', 'task:read', 'task:update', 
    'user:manage', 'log:read'
  ],
  Viewer: [
    'task:read'
  ]
};

@Injectable() 
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting database seeding...');
    await this.seedRolesAndPermissions();
    await this.seedDefaultOrganization();
    await this.seedDefaultUser();
    this.logger.log('Database seeding complete.');
  }

  private async seedRolesAndPermissions() {
    this.logger.log('Seeding roles and permissions...');
    for (const [roleName, actions] of Object.entries(ROLE_PERMISSIONS)) {
      
      // 1. Create or find the Role
      let role = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!role) {
        role = await this.roleRepository.save(this.roleRepository.create({ name: roleName }));
        this.logger.log(`Created Role: ${roleName}`);
      }

      // 2. Create Permissions associated with this Role
      for (const action of actions) {
        const permissionExists = await this.permissionRepository.findOne({ 
          where: { action: action, roleId: role.id } 
        });

        if (!permissionExists) {
          await this.permissionRepository.save(
            this.permissionRepository.create({ action, roleId: role.id })
          );
          this.logger.verbose(`   - Added permission: ${action}`);
        }
      }
    }
  }
  
  private async seedDefaultOrganization() {
    let org = await this.orgRepository.findOne({ where: { name: DEFAULT_ORG_NAME } });
    
    if (!org) {
      org = await this.orgRepository.save(
        this.orgRepository.create({ name: DEFAULT_ORG_NAME })
      );
      this.logger.log(`Created default organization: ${DEFAULT_ORG_NAME}`);
    }
  }

  private async seedDefaultUser() {
    const org = await this.orgRepository.findOne({ where: { name: DEFAULT_ORG_NAME } });
    const ownerRole = await this.roleRepository.findOne({ where: { name: 'Owner' } });

    if (!org || !ownerRole) {
        this.logger.error('Failed to seed default user: Organization or Owner Role missing.');
        return;
    }

    const userExists = await this.usersService.findByUsername(DEFAULT_USER_DATA.username);
    if (!userExists) {
      await this.usersService.createUser(
        DEFAULT_USER_DATA.username, 
        DEFAULT_USER_DATA.password, 
        ownerRole.id, 
        org.id
      );
      this.logger.warn(`Default Owner User created: ${DEFAULT_USER_DATA.username}`);
    } else {
      this.logger.log('Default Owner User already exists.');
    }
  }
}