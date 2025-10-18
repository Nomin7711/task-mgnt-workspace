import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  roleId?: number; 

  @IsInt()
  @IsOptional()
  @Min(1)
  organizationId?: number; 
}