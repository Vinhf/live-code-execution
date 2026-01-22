import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './queue/queue.module';
import { CodeSessionModule } from './code-session/code-session.module';
import { ExecutionModule } from './execution/execution.module';

@Module({
  imports: [
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
