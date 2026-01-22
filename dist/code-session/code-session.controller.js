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
exports.CodeSessionController = void 0;
const common_1 = require("@nestjs/common");
const code_session_service_1 = require("./code-session.service");
const update_code_dto_1 = require("./dto/update-code.dto");
const swagger_1 = require("@nestjs/swagger");
let CodeSessionController = class CodeSessionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create() {
        const session = await this.service.create('python');
        return { session_id: session.id, status: session.status };
    }
    async autosave(id, dto) {
        await this.service.update(id, dto.sourceCode);
        return { session_id: id, status: 'ACTIVE' };
    }
    getAll() {
        return this.service.getAllSessions();
    }
};
exports.CodeSessionController = CodeSessionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new code session' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Session created',
        schema: {
            example: {
                session_id: 'uuid',
                status: 'ACTIVE',
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodeSessionController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Autosave code for a session' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_code_dto_1.UpdateCodeDto]),
    __metadata("design:returntype", Promise)
], CodeSessionController.prototype, "autosave", null);
__decorate([
    (0, swagger_1.ApiTags)('Debug'),
    (0, swagger_1.ApiOperation)({ summary: '[DEBUG] Get all code sessions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all code sessions',
        schema: {
            example: [
                {
                    id: 'uuid',
                    language: 'python',
                    sourceCode: "print('Hello World')",
                    status: 'ACTIVE',
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CodeSessionController.prototype, "getAll", null);
exports.CodeSessionController = CodeSessionController = __decorate([
    (0, swagger_1.ApiTags)('Code Sessions'),
    (0, common_1.Controller)('code-sessions'),
    __metadata("design:paramtypes", [code_session_service_1.CodeSessionService])
], CodeSessionController);
//# sourceMappingURL=code-session.controller.js.map