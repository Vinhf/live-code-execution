"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const execution_entity_1 = require("./execution.entity");
const bullmq_1 = require("@nestjs/bullmq");
const code_session_module_1 = require("../code-session/code-session.module");
const execution_controller_1 = require("./execution.controller");
const execution_service_1 = require("./execution.service");
const execution_processor_1 = require("./execution.processor");
let ExecutionModule = class ExecutionModule {
};
exports.ExecutionModule = ExecutionModule;
exports.ExecutionModule = ExecutionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([execution_entity_1.Execution]),
            bullmq_1.BullModule.registerQueue({
                name: 'execution-queue',
            }),
            code_session_module_1.CodeSessionModule,
        ],
        controllers: [execution_controller_1.ExecutionController],
        providers: [execution_service_1.ExecutionService, execution_processor_1.ExecutionProcessor],
    })
], ExecutionModule);
//# sourceMappingURL=execution.module.js.map