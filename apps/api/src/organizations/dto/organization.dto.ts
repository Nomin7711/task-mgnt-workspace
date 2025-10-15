import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

// Used for creating a new organization
export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsOptional()
  @Min(1) 
  parentId?: number | null; 
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  parentId?: number | null;
}