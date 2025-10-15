import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Organization } from '@task-mgnt-workspace/data';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async findAllDescendantsIds(parentId: number): Promise<number[]> {
    const allOrgs = await this.orgRepository.find({ select: ['id', 'parentId'] });
    const descendantIds = new Set<number>([parentId]);
    
    let currentLevel = [parentId];
    
    while (currentLevel.length > 0) {
        const nextLevel: number[] = [];
        for (const currentId of currentLevel) {
            const children = allOrgs.filter(
                org => org.parentId === currentId && !descendantIds.has(org.id)
            );
            
            children.forEach(child => {
                descendantIds.add(child.id);
                nextLevel.push(child.id);
            });
        }
        currentLevel = nextLevel;
    }
    
    return Array.from(descendantIds);
  }

  async create(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    if (createOrgDto.parentId) {
      const parent = await this.orgRepository.findOneBy({ id: createOrgDto.parentId });
      if (!parent) {
        throw new NotFoundException(`Parent organization with ID ${createOrgDto.parentId} not found.`);
      }
    }
    
    const newOrg = this.orgRepository.create(createOrgDto);
    
    return this.orgRepository.save(newOrg);
  }

async findAllScoped(user: any): Promise<Organization[]> {
    if (user.roleId === 1) {
      return this.orgRepository.find();
    }
    
    if (user.roleId === 2) {
      const scopedIds = await this.findAllDescendantsIds(user.organizationId);
      
      return this.orgRepository.find({ 
        where: { 
          id: In(scopedIds) 
        } 
      });
    }
  
    return this.orgRepository.findBy({ id: user.organizationId });
  }

  async update(id: number, updateOrgDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.orgRepository.findOneBy({ id });
    
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found.`);
    }

    if (updateOrgDto.parentId === id) {
      throw new ConflictException('An organization cannot be its own parent.');
    }
    
    Object.assign(organization, updateOrgDto);
    return this.orgRepository.save(organization);
  }

  async remove(id: number): Promise<void> {
    const organization = await this.orgRepository.findOne({
      where: { id },
      relations: ['users', 'tasks', 'children'], 
    });

    if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found.`);
    }
    
    if (organization.users && organization.users.length > 0) {
      throw new ConflictException('Cannot delete organization: it still contains active users.');
    }
    if (organization.tasks && organization.tasks.length > 0) {
      throw new ConflictException('Cannot delete organization: it still contains active tasks.');
    }
    if (organization.children && organization.children.length > 0) {
        throw new ConflictException('Cannot delete organization: it has sub-organizations.');
    }

    await this.orgRepository.delete(id);
  }
}