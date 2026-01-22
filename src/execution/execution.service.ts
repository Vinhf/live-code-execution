import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findById(id: string) {
    const execution = await this.repo.findOneBy({ id });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    return {
      execution_id: execution.id,
      status: execution.status,
      stdout: execution.stdout ?? '',
      stderr: execution.stderr ?? '',
      execution_time_ms: execution.executionTimeMs ?? 0,
    };
  }

  async enqueueExecution(payload: any) {
    const job = await this.queue.add('execute', payload);
    return {
      jobId: job.id,
      status: 'queued',
    };
  }

  getAllExecutions() {
    return this.repo.find();
  }

  getExecutionsBySession(sessionId: string) {
    return this.repo.find({
      where: { session: { id: sessionId } },
    });
  }
}
