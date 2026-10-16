export interface UserFactoryInput {
  name?: string;
  email?: string;
}

export function buildUser(overrides: UserFactoryInput = {}): { name: string; email: string } {
  return {
    name: overrides.name ?? 'Test User',
    email: overrides.email ?? 'test@example.com',
  };
}
