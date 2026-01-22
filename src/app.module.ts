import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './queue/queue.module';
import { CodeSessionModule } from './code-session/code-session.module';
import { ExecutionModule } from './execution/execution.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
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
