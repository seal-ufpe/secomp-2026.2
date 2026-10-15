import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { fromEvent, interval, map, merge, type Observable } from 'rxjs';

import { getRepositories } from './get-repositories';

@Controller('projects')
export class ProjectsStreamController {
  @Sse('stream')
  async stream(): Promise<Observable<MessageEvent>> {
    const repositories = await getRepositories();
    const changes = fromEvent(repositories.projects.changes, 'change').pipe(
      map((event) => {
        const { type, project } = event as {
          type: string;
          project: { _id: string; editTokenHash?: string; status?: string };
        };
        const { editTokenHash: _editTokenHash, ...publicProject } = project;
        return {
          type,
          data: project.status === 'hidden' ? { _id: project._id, deleted: true } : publicProject,
        };
      }),
    );
    const heartbeat = interval(25_000).pipe(map(() => ({ type: 'heartbeat', data: {} })));
    return merge(changes, heartbeat);
  }
}
