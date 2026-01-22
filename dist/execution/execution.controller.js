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
exports.ExecutionController = void 0;
const common_1 = require("@nestjs/common");
const execution_service_1 = require("./execution.service");
const code_session_service_1 = require("../code-session/code-session.service");
const swagger_1 = require("@nestjs/swagger");
let ExecutionController = class ExecutionController {
    executionService;
    sessionService;
    constructor(executionService, sessionService) {
        this.executionService = executionService;
        this.sessionService = sessionService;
    }
    async run(id) {
        const session = await this.sessionService.findById(id);
        if (!session) {
            throw new Error('Code session not found');
        }
        const execution = await this.executionService.run(session);
        return { execution_id: execution.id, status: execution.status };
    }
    async getResult(id) {
        return this.executionService.findById(id);
    }
    enqueue(body) {
        return this.executionService.enqueueExecution(body);
    }
    getAll() {
        return this.executionService.getAllExecutions();
    }
    getExecutionsBySession(sessionId) {
        return this.executionService.getExecutionsBySession(sessionId);
    }
};
exports.ExecutionController = ExecutionController;
__decorate([
    (0, common_1.Post)('code-sessions/:id/run'),
    (0, swagger_1.ApiTags)('Code Sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Run code asynchronously' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Execution queued',
        schema: {
            example: {
                execution_id: 'uuid',
                status: 'QUEUED',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "run", null);
__decorate([
    (0, common_1.Get)('executions/:id'),
    (0, swagger_1.ApiTags)('Executions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get execution result' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Execution ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Execution result',
        schema: {
            example: {
                execution_id: 'uuid',
                status: 'COMPLETED',
                stdout: 'Hello World\n',
                stderr: '',
                execution_time_ms: 120,
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "getResult", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiTags)('Executions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExecutionController.prototype, "enqueue", null);
__decorate([
    (0, swagger_1.ApiTags)('Debug'),
    (0, common_1.Get)('debug/executions'),
    (0, swagger_1.ApiOperation)({ summary: '[DEBUG] Get all executions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all executions',
        schema: {
            example: [
                {
                    execution_id: 'uuid',
                    status: 'COMPLETED',
                    stdout: 'Hello World\n',
                    stderr: '',
                    execution_time_ms: 120,
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExecutionController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiTags)('Debug'),
    (0, common_1.Get)('sessions/:id/executions'),
    (0, swagger_1.ApiOperation)({ summary: '[DEBUG] Get executions by session ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Executions for a session',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExecutionController.prototype, "getExecutionsBySession", null);
exports.ExecutionController = ExecutionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [execution_service_1.ExecutionService,
        code_session_service_1.CodeSessionService])
], ExecutionController);
//# sourceMappingURL=execution.controller.js.map