import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { fromEvent, interval, merge, map, Observable } from 'rxjs';
import { getRepositories } from './get-repositories';

@Controller('projects')
export class ProjectsStreamController {
  @Sse('stream')
  async stream(): Promise<Observable<MessageEvent>> {
    const repositories = await getRepositories();
    const changes = fromEvent<{ type: string; project: { _id: string; editTokenHash?: string; status?: string } }>(repositories.projects.changes, 'change').pipe(
      map(({ type, project }) => {
        const { editTokenHash, ...publicProject } = project;
        void editTokenHash;
        return { type, data: project.status === 'hidden' ? { _id: project._id, deleted: true } : publicProject };
      }),
    );
    const heartbeat = interval(25_000).pipe(map(() => ({ type: 'heartbeat', data: {} })));
    return merge(changes, heartbeat);
  }
}
