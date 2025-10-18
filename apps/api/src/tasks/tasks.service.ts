import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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

  // Determine the access scope based on user role
  private async getAccessScope(user: RequestUser): Promise<FindOptionsWhere<Task> | FindOptionsWhere<Task>[]> {
    if (user.roleId === 1) return {}; // Admin: full access
    if (user.roleId === 2) return { organizationId: user.organizationId }; // Manager: org tasks
    if (user.roleId === 3) return [
      { organizationId: user.organizationId },
      { ownerId: user.id }, // Owner: their own tasks
    ];
    return { id: -1 }; // No access fallback
  }

  // CREATE Task
  async create(taskDto: CreateTaskDto, user: RequestUser): Promise<Task> {
    // Defaults if FE doesn't send them
    const task = this.taskRepository.create({
      ...taskDto,
      status: taskDto.status || 'To Do',
      category: taskDto.category || 'Work',
      priority: taskDto.priority || 'Medium',
      ownerId: user.id,
      organizationId: user.organizationId,
    });

    const createdTask = await this.taskRepository.save(task);
    await this.auditLogService.recordAction(user.id, 'task:create', { taskId: createdTask.id });
    return createdTask;
  }

  // READ all tasks
  async findAll(user: RequestUser): Promise<Task[]> {
    const scope = await this.getAccessScope(user);

    return this.taskRepository.find({
      where: scope,
      relations: ['owner', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  // READ single task
  async findOne(id: number, user: RequestUser): Promise<Task> {
    const scope = await this.getAccessScope(user);

    const task = await this.taskRepository.findOne({
      where: { id, ...scope } as FindOptionsWhere<Task>,
      relations: ['owner', 'organization'],
    });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found or access denied.`);
    return task;
  }

  // Check permission for updates/deletes
  private isAuthorizedToModify(task: Task, user: RequestUser): boolean {
    if (user.roleId === 1 || user.roleId === 2) return true; // Admin/Manager can modify
    if (user.roleId === 3) return task.ownerId === user.id; // Owner can modify own tasks
    return false;
  }

  // UPDATE Task
  async update(id: number, updateTaskDto: UpdateTaskDto, user: RequestUser): Promise<Task> {
    const task = await this.findOne(id, user);

    if (!this.isAuthorizedToModify(task, user))
      throw new ForbiddenException('You do not have permission to modify this task.');

    Object.assign(task, updateTaskDto); // Merge updates
    const updatedTask = await this.taskRepository.save(task);
    await this.auditLogService.recordAction(user.id, 'task:update', { taskId: updatedTask.id });
    return updatedTask;
  }

  // DELETE Task
  async remove(id: number, user: RequestUser): Promise<void> {
    const task = await this.findOne(id, user);

    if (!this.isAuthorizedToModify(task, user))
      throw new ForbiddenException('You do not have permission to delete this task.');

    await this.taskRepository.remove(task);
    await this.auditLogService.recordAction(user.id, 'task:delete', { taskId: id });
  }
}
