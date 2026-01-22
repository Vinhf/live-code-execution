import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'execution-queue',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
