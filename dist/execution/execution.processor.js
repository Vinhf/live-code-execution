"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const execution_entity_1 = require("./execution.entity");
const execution_status_enum_1 = require("../common/enums/execution-status.enum");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ExecutionProcessor = class ExecutionProcessor extends bullmq_1.WorkerHost {
    executionRepo;
    constructor(executionRepo) {
        super();
        this.executionRepo = executionRepo;
    }
    async process(job) {
        const { executionId, sourceCode } = job.data;
        const execution = await this.executionRepo.findOne({
            where: { id: executionId },
        });
        if (!execution)
            return;
        execution.status = execution_status_enum_1.ExecutionStatus.RUNNING;
        execution.startedAt = new Date();
        await this.executionRepo.save(execution);
        const startTime = Date.now();
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        const filePath = path.join(tmpDir, `${executionId}.py`);
        fs.writeFileSync(filePath, sourceCode);
        const pythonProcess = (0, child_process_1.spawn)('python', [filePath]);
        let stdout = '';
        let stderr = '';
        let isTimeout = false;
        const timeout = setTimeout(() => {
            isTimeout = true;
            pythonProcess.kill('SIGKILL');
        }, 3000);
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
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
                    execution.status = execution_status_enum_1.ExecutionStatus.TIMEOUT;
                }
                else if (code === 0) {
                    execution.status = execution_status_enum_1.ExecutionStatus.COMPLETED;
                }
                else {
                    execution.status = execution_status_enum_1.ExecutionStatus.FAILED;
                }
                await this.executionRepo.save(execution);
                fs.unlinkSync(filePath);
            })();
        });
    }
};
exports.ExecutionProcessor = ExecutionProcessor;
exports.ExecutionProcessor = ExecutionProcessor = __decorate([
    (0, bullmq_1.Processor)('execution-queue'),
    __param(0, (0, typeorm_1.InjectRepository)(execution_entity_1.Execution)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExecutionProcessor);
//# sourceMappingURL=execution.processor.js.map