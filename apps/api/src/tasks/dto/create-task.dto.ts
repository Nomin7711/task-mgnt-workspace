// src/tasks/dto/create-task.dto.ts

import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title!: string;

  @IsString()
  @IsOptional()
  content?: string;

}