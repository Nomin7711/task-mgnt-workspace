import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@task-mgnt-workspace/data';
import { OrganizationService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [OrganizationsController], 
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}