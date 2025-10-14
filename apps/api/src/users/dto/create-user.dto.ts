import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string; // Will be hashed by the service

  @IsNumber()
  @IsNotEmpty()
  roleId!: number; // e.g., 2 for 'Admin', 3 for 'Viewer'

  @IsNumber()
  @IsNotEmpty()
  organizationId!: number; // e.g., 1 for 'Corporate Headquarters'

  @IsString()
  @IsOptional()
  displayName?: string;
}