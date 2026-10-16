import { describe, expect, it } from 'vitest';
import { filterProjects } from './projects';

const projects = [
  { _id: '1', title: 'App Recife', authorName: 'Ana', origin: 'lovable', createdAt: '2026-01-01' },
  { _id: '2', title: 'Agenda', authorName: 'Bruno', origin: 'base44', createdAt: '2026-01-02' },
] as const;

describe('filterProjects', () => {
  it('filters by title/author and origin without mutating input', () => {
    expect(filterProjects([...projects], ' recife ', 'all').map((item) => item._id)).toEqual(['1']);
    expect(filterProjects([...projects], '', 'base44').map((item) => item._id)).toEqual(['2']);
  });
});
