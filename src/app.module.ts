import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './queue/queue.module';
import { CodeSessionModule } from './code-session/code-session.module';
import { ExecutionModule } from './execution/execution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'livecode-db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    QueueModule,
    CodeSessionModule,
    ExecutionModule,
  ],
})
export class AppModule {}
