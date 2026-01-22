import { CodeSessionService } from './code-session.service';
import { UpdateCodeDto } from './dto/update-code.dto';
export declare class CodeSessionController {
    private readonly service;
    constructor(service: CodeSessionService);
    create(): Promise<{
        session_id: string;
        status: string;
    }>;
    autosave(id: string, dto: UpdateCodeDto): Promise<{
        session_id: string;
        status: string;
    }>;
}
