import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Execution } from './execution.entity';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CodeSession } from 'src/code-session/code-session.entity';
import { ExecutionStatus } from 'src/common/enums/execution-status.enum';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(Execution)
    private repo: Repository<Execution>,
    @InjectQueue('execution-queue')
    private queue: Queue,
  ) {}

  async run(session: CodeSession) {
    const execution = await this.repo.save({
      session,
      status: ExecutionStatus.QUEUED,
    });

    await this.queue.add('execute', {
      executionId: execution.id,
      sourceCode: session.sourceCode,
      language: session.language,
    });

    return execution;
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }
}
