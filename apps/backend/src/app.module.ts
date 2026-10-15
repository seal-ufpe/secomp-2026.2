import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminController } from './admin/admin.controller';
import { validateEnvironment } from './app.config';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { getRepositories } from './projects/get-repositories';
import { PROJECT_SERVICE, ProjectService } from './projects/project-service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsStreamController } from './projects/projects-stream.controller';
import { PROJECT_REPOSITORIES } from './projects/repositories';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    DatabaseModule,
  ],
  controllers: [
    HealthController,
    UsersController,
    ProjectsController,
    ProjectsStreamController,
    AdminController,
  ],
  providers: [
    UsersService,
    { provide: PROJECT_REPOSITORIES, useFactory: getRepositories },
    {
      provide: PROJECT_SERVICE,
      inject: [PROJECT_REPOSITORIES],
      useFactory: (repositories: Awaited<ReturnType<typeof getRepositories>>) =>
        new ProjectService(repositories),
    },
  ],
})
export class AppModule {}
