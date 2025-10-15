
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type RequestWithUser = Request & { user: any };

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionGuard) 
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @RequirePermission('task:create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: RequestWithUser, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  @RequirePermission('task:read')
  async findAll(@Req() req: RequestWithUser) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermission('task:read')
  async findOne(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.tasksService.findOne(id, req.user);
  }

  @Put(':id')
  @RequirePermission('task:update')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Req() req: RequestWithUser) {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @RequirePermission('task:delete')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    await this.tasksService.remove(id, req.user);
  }
}