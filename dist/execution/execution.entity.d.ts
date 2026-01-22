import { CodeSession } from 'src/code-session/code-session.entity';
export declare class Execution {
    id: string;
    session: CodeSession;
    status: string;
    stdout: string;
    stderr: string;
    executionTimeMs: number;
    startedAt: Date;
    finishedAt: Date;
    createdAt: Date;
}
