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
};
exports.ExecutionController = ExecutionController;
__decorate([
    (0, common_1.Post)('code-sessions/:id/run'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "run", null);
__decorate([
    (0, common_1.Get)('executions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "getResult", null);
exports.ExecutionController = ExecutionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [execution_service_1.ExecutionService,
        code_session_service_1.CodeSessionService])
], ExecutionController);
//# sourceMappingURL=execution.controller.js.map