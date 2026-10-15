import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, type Db } from 'mongodb';

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
        if (!uri || !databaseName) {
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
