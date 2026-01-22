import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Execution } from './execution.entity';
import { ExecutionStatus } from '../common/enums/execution-status.enum';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Processor('execution-queue')
export class ExecutionProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Execution)
    private readonly executionRepo: Repository<Execution>,
  ) {
    super();
  }

  async process(
    job: Job<{ executionId: string; sourceCode: string }>,
  ): Promise<void> {
    const { executionId, sourceCode } = job.data;

    const execution = await this.executionRepo.findOne({
      where: { id: executionId },
    });

    if (!execution) return;

    execution.status = ExecutionStatus.RUNNING;
    execution.startedAt = new Date();
    await this.executionRepo.save(execution);

    const startTime = Date.now();

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const filePath = path.join(tmpDir, `${executionId}.py`);
    fs.writeFileSync(filePath, sourceCode);

    const pythonProcess = spawn('python', [filePath]);

    let stdout = '';
    let stderr = '';
    let isTimeout = false;

    const timeout = setTimeout(() => {
      isTimeout = true;
      pythonProcess.kill('SIGKILL');
    }, 3000);

    pythonProcess.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    pythonProcess.on('close', (code) => {
      void (async () => {
        clearTimeout(timeout);

        execution.finishedAt = new Date();
        execution.executionTimeMs = Date.now() - startTime;
        execution.stdout = stdout;
        execution.stderr = stderr;

        if (isTimeout) {
          execution.status = ExecutionStatus.TIMEOUT;
        } else if (code === 0) {
          execution.status = ExecutionStatus.COMPLETED;
        } else {
          execution.status = ExecutionStatus.FAILED;
        }

        await this.executionRepo.save(execution);

        fs.unlinkSync(filePath);
      })();
    });
  }
}
