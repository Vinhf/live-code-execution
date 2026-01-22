"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const execution_entity_1 = require("./execution.entity");
const typeorm_2 = require("typeorm");
const bullmq_1 = require("bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const execution_status_enum_1 = require("../common/enums/execution-status.enum");
let ExecutionService = class ExecutionService {
    repo;
    queue;
    constructor(repo, queue) {
        this.repo = repo;
        this.queue = queue;
    }
    async run(session) {
        const execution = await this.repo.save({
            session,
            status: execution_status_enum_1.ExecutionStatus.QUEUED,
        });
        await this.queue.add('execute', {
            executionId: execution.id,
            sourceCode: session.sourceCode,
            language: session.language,
        });
        return execution;
    }
    async findById(id) {
        const execution = await this.repo.findOneBy({ id });
        if (!execution) {
            throw new common_1.NotFoundException('Execution not found');
        }
        return {
            execution_id: execution.id,
            status: execution.status,
            stdout: execution.stdout ?? '',
            stderr: execution.stderr ?? '',
            execution_time_ms: execution.executionTimeMs ?? 0,
        };
    }
    async enqueueExecution(payload) {
        const job = await this.queue.add('execute', payload);
        return {
            jobId: job.id,
            status: 'queued',
        };
    }
    getAllExecutions() {
        return this.repo.find();
    }
    getExecutionsBySession(sessionId) {
        return this.repo.find({
            where: { session: { id: sessionId } },
        });
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(execution_entity_1.Execution)),
    __param(1, (0, bullmq_2.InjectQueue)('execution-queue')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bullmq_1.Queue])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map