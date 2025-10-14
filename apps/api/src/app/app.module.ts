// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from '../users/users.module';
// import { AuthModule } from '../auth/auth.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'sqlite',
//       database: process.env.DB_TYPE === 'postgres'
//         ? process.env.DB_NAME
//         : 'data/sqlite.db',
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true, // ⚠️ For dev only
//     }),
//     UsersModule,
//     AuthModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  User,
  Organization,
  Role,
  Permission,
  Task,
} from '@task-mgnt-workspace/data'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',                       
      database: 'data/sqlite.db',           
      entities: [User, Organization, Role, Permission, Task],
      synchronize: true,                    
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

