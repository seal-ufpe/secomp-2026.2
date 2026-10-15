import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';

import { configureApp } from './app.config';
import { AppModule } from './app.module';

function getPort(value: string | undefined): number {
  return typeof value === 'string' && value.length > 0 ? Number(value) : 4000;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  configureApp(app);
  await app.listen(getPort(process.env.PORT), '0.0.0.0');
}

void bootstrap();
