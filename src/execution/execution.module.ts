import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Execution } from './execution.entity';
import { BullModule } from '@nestjs/bullmq';
import { CodeSessionModule } from 'src/code-session/code-session.module';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { ExecutionProcessor } from './execution.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Execution]),
    BullModule.registerQueue({
      name: 'execution-queue',
    }),
    CodeSessionModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, ExecutionProcessor],
})
export class ExecutionModule {}
