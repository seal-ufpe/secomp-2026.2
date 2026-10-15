import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export interface EnvironmentConfig {
  MONGODB_URI?: string;
  MONGODB_DB?: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  AUDIT_SALT: string;
  COURSE_CODE: string;
  ALLOWED_HOST_SUFFIXES: string;
  USE_FAKE_DB?: string;
  PORT?: string;
  NODE_ENV?: string;
}

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function textValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getMissingEnvironment(environment: Record<string, unknown>): string[] {
  const required = [
    'ADMIN_PASSWORD',
    'SESSION_SECRET',
    'AUDIT_SALT',
    'COURSE_CODE',
    'ALLOWED_HOST_SUFFIXES',
  ];
  const missing = required.filter((key) => !hasText(textValue(environment[key])));
  if (
    environment.USE_FAKE_DB !== '1' &&
    (!hasText(textValue(environment.MONGODB_URI)) || !hasText(textValue(environment.MONGODB_DB)))
  ) {
    missing.push('MONGODB_URI', 'MONGODB_DB');
  }
  return missing;
}

export function validateEnvironment(environment: Record<string, unknown>): EnvironmentConfig {
  const missing = getMissingEnvironment(environment);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  const mongodbUri = textValue(environment.MONGODB_URI);
  const mongodbDb = textValue(environment.MONGODB_DB);
  return {
    ADMIN_PASSWORD: String(environment.ADMIN_PASSWORD),
    SESSION_SECRET: String(environment.SESSION_SECRET),
    AUDIT_SALT: String(environment.AUDIT_SALT),
    COURSE_CODE: String(environment.COURSE_CODE),
    ALLOWED_HOST_SUFFIXES: String(environment.ALLOWED_HOST_SUFFIXES),
    MONGODB_URI: mongodbUri,
    MONGODB_DB: mongodbDb,
    USE_FAKE_DB: textValue(environment.USE_FAKE_DB),
    PORT: textValue(environment.PORT),
    NODE_ENV: textValue(environment.NODE_ENV),
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<{
      status: (code: number) => { send: (body: unknown) => void };
    }>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? this.getHttpMessage(exceptionResponse)
          : exception.message;
    }
    response.status(status).send({ error: { code: this.getErrorCode(status), message } });
  }

  private getHttpMessage(response: object): string {
    if ('message' in response) {
      const message = response.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
        return message.join(', ');
      }
    }
    return 'Request failed';
  }

  private getErrorCode(status: number): string {
    if (status >= 500) return 'internal_error';
    return `http_${String(status)}`;
  }
}

export function configureApp(app: INestApplication): void {
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
}
