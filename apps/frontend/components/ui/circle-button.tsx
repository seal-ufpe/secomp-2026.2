import * as React from 'react';
import { Button, type ButtonProps } from './button';

export function CircleButton(props: ButtonProps) {
  return <Button {...props} size="icon" className="border-neon" />;
}
