// src/tasks/dto/update-task.dto.ts

import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title?: string;
  
  @IsString()
  @IsOptional()
  content?: string;
  
  @IsString()
  @IsOptional()
  @IsIn(['open', 'in-progress', 'done'])
  status?: string;
}

