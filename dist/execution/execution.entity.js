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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execution = void 0;
const code_session_entity_1 = require("../code-session/code-session.entity");
const typeorm_1 = require("typeorm");
let Execution = class Execution {
    id;
    session;
    status;
    stdout;
    stderr;
    executionTimeMs;
    startedAt;
    finishedAt;
    createdAt;
};
exports.Execution = Execution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Execution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => code_session_entity_1.CodeSession),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", code_session_entity_1.CodeSession)
], Execution.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Execution.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Execution.prototype, "stdout", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Execution.prototype, "stderr", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Execution.prototype, "executionTimeMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Execution.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Execution.prototype, "finishedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Execution.prototype, "createdAt", void 0);
exports.Execution = Execution = __decorate([
    (0, typeorm_1.Entity)('executions')
], Execution);
//# sourceMappingURL=execution.entity.js.map