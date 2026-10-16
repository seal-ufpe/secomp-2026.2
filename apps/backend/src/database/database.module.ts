import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Db, MongoClient } from 'mongodb';

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

export const DATABASE = Symbol('DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<Db> => {
        const uri = config.get<string>('MONGODB_URI');
        const databaseName = config.get<string>('MONGODB_DB');
        if (!hasText(uri) || !hasText(databaseName)) {
          throw new Error('MONGODB_URI and MONGODB_DB are required to start the application.');
        }
        const client = new MongoClient(uri);
        await client.connect();
        return client.db(databaseName);
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
