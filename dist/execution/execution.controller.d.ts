import { ExecutionService } from './execution.service';
import { CodeSessionService } from 'src/code-session/code-session.service';
export declare class ExecutionController {
    private executionService;
    private sessionService;
    constructor(executionService: ExecutionService, sessionService: CodeSessionService);
    run(id: string): Promise<{
        execution_id: string;
        status: import("../common/enums/execution-status.enum").ExecutionStatus;
    }>;
    getResult(id: string): Promise<{
        execution_id: string;
        status: string;
        stdout: string;
        stderr: string;
        execution_time_ms: number;
    }>;
    enqueue(body: any): Promise<{
        jobId: string | undefined;
        status: string;
    }>;
    getAll(): Promise<import("./execution.entity").Execution[]>;
    getExecutionsBySession(sessionId: string): Promise<import("./execution.entity").Execution[]>;
}
