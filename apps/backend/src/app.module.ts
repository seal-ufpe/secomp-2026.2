import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProjectsController } from './projects/projects.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [HealthController, UsersController, ProjectsController],
  providers: [UsersService],
})
export class AppModule {}
