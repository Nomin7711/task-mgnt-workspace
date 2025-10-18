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
