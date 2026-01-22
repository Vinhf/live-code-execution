"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const queue_module_1 = require("./queue/queue.module");
const code_session_module_1 = require("./code-session/code-session.module");
const execution_module_1 = require("./execution/execution.module");
const bullmq_1 = require("@nestjs/bullmq");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || 'redis',
                    port: 6379,
                },
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'db.sqlite',
                autoLoadEntities: true,
                synchronize: true,
            }),
            queue_module_1.QueueModule,
            code_session_module_1.CodeSessionModule,
            execution_module_1.ExecutionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map