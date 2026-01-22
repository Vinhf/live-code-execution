import { Execution } from './execution.entity';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { CodeSession } from 'src/code-session/code-session.entity';
import { ExecutionStatus } from 'src/common/enums/execution-status.enum';
export declare class ExecutionService {
    private repo;
    private queue;
    constructor(repo: Repository<Execution>, queue: Queue);
    run(session: CodeSession): Promise<{
        session: CodeSession;
        status: ExecutionStatus;
    } & Execution>;
    findById(id: string): Promise<Execution | null>;
}
