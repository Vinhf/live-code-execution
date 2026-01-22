import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Execution } from './execution.entity';
export declare class ExecutionProcessor extends WorkerHost {
    private readonly executionRepo;
    constructor(executionRepo: Repository<Execution>);
    process(job: Job<{
        executionId: string;
        sourceCode: string;
    }>): Promise<void>;
}
