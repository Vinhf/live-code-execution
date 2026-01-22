import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './queue/queue.module';
import { CodeSessionModule } from './code-session/code-session.module';
import { ExecutionModule } from './execution/execution.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    QueueModule,
    CodeSessionModule,
    ExecutionModule,
  ],
})
export class AppModule {}
