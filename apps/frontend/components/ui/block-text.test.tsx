import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlockText } from './block-text';

describe('BlockText', () => {
  it('renders a neon heading block', () => {
    render(<BlockText>Projetos no ar</BlockText>);
    expect(screen.getByRole('heading', { name: 'Projetos no ar' })).toHaveClass(
      'bg-magenta',
      'text-neon',
    );
  });
});
