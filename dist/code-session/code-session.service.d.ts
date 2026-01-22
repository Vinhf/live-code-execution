import { Repository } from 'typeorm';
import { CodeSession } from './code-session.entity';
export declare class CodeSessionService {
    private repo;
    constructor(repo: Repository<CodeSession>);
    create(language: string): Promise<{
        language: string;
        sourceCode: string;
        status: string;
    } & CodeSession>;
    update(id: string, sourceCode: string): Promise<import("typeorm").UpdateResult>;
    findById(id: string): Promise<CodeSession | null>;
}
