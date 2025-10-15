import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@task-mgnt-workspace/data';
import { OrganizationService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    AuthModule 
  ],
  controllers: [OrganizationsController], 
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}