import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization, Role, Permission } from '@task-mgnt-workspace/data';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Role, Permission]),
    UsersModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}