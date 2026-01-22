import { Execution } from './execution.entity';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { CodeSession } from '../code-session/code-session.entity';
import { ExecutionStatus } from '../common/enums/execution-status.enum';
export declare class ExecutionService {
    private repo;
    private queue;
    constructor(repo: Repository<Execution>, queue: Queue);
    run(session: CodeSession): Promise<{
        session: CodeSession;
        status: ExecutionStatus;
    } & Execution>;
    findById(id: string): Promise<{
        execution_id: string;
        status: string;
        stdout: string;
        stderr: string;
        execution_time_ms: number;
    }>;
    enqueueExecution(payload: any): Promise<{
        jobId: string | undefined;
        status: string;
    }>;
    getAllExecutions(): Promise<Execution[]>;
    getExecutionsBySession(sessionId: string): Promise<Execution[]>;
}
