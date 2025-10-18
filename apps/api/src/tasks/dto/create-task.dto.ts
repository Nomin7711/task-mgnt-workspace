// src/tasks/dto/create-task.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsIn, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Work', 'Personal', 'Other'])
  category?: string;

  @IsString()
  @IsOptional()
  @IsIn(['High', 'Medium', 'Low'])
  priority?: string;

  @IsString()
  @IsOptional()
  @IsIn(['To Do', 'In Progress', 'Done'])
  status?: string;
}
