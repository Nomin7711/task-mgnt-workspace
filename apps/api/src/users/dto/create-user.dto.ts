import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string; 

  @IsNumber()
  @IsNotEmpty()
  roleId!: number; 

  @IsNumber()
  @IsNotEmpty()
  organizationId!: number; 

  @IsString()
  @IsOptional()
  displayName?: string;
}