
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { Task } from '@task-mgnt-workspace/data';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { OrganizationService } from '../organizations/organizations.service';

type RequestUser = { 
    id: number; 
    username: string; 
    roleId: number; 
    organizationId: number;
    permissions: string[];
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly organizationService: OrganizationService, 
    private readonly auditLogService: AuditLogService,
  ) {}

  private async getAccessScope(user: RequestUser): Promise<FindOptionsWhere<Task> | FindOptionsWhere<Task>[]> {
    if (user.roleId === 1) { 
      return {}; 
    } 
    const organizationId = user.organizationId;

    if (user.roleId === 2) {
        return { organizationId }; 
    } 
    
    if (user.roleId === 3) {
      return [
        { organizationId },
        { ownerId: user.id }, 
      ];
    }

    return { id: -1 }; 
  }

  async create(taskDto: CreateTaskDto, user: RequestUser): Promise<Task> {
    const task = this.taskRepository.create({
      ...taskDto,
      ownerId: user.id, 
      organizationId: user.organizationId, 
    });
    const createdTask = await this.taskRepository.save(task);
    await this.auditLogService.recordAction(user.id, 'task:create', { taskId: createdTask.id });
    return createdTask;
  }

  async findAll(user: RequestUser): Promise<Task[]> {
    const scope = await this.getAccessScope(user);
    
    return this.taskRepository.find({ 
      where: scope,
      relations: ['owner', 'organization'], 
    });
  }

  async findOne(id: number, user: RequestUser): Promise<Task> {
    const scope = await this.getAccessScope(user);
    
    const task = await this.taskRepository.findOne({ 
      where: { id, ...scope } as FindOptionsWhere<Task>, 
      relations: ['owner', 'organization']
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or access denied.`);
    }
    return task;
  }

private isAuthorizedToModify(task: Task, user: RequestUser): boolean {
    if (user.roleId === 1) {
        return true;
    }

    if (user.roleId === 2) {
        return true;
    }

    if (user.roleId === 3) {
        return task.ownerId === user.id;
    }
    
    return false;
}
  
  async update(id: number, updateTaskDto: UpdateTaskDto, user: RequestUser): Promise<Task> {
    const task = await this.findOne(id, user); 

    if (!this.isAuthorizedToModify(task, user)) {
        throw new ForbiddenException('You do not have permission to modify this specific task.');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, user: RequestUser): Promise<void> {
    const task = await this.findOne(id, user); 

    if (!this.isAuthorizedToModify(task, user)) {
        throw new ForbiddenException('You do not have permission to delete this specific task.');
    }

    await this.taskRepository.remove(task);
  }
}