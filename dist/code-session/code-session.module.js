"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSessionModule = void 0;
const common_1 = require("@nestjs/common");
const code_session_entity_1 = require("./code-session.entity");
const code_session_controller_1 = require("./code-session.controller");
const code_session_service_1 = require("./code-session.service");
const typeorm_1 = require("@nestjs/typeorm");
let CodeSessionModule = class CodeSessionModule {
};
exports.CodeSessionModule = CodeSessionModule;
exports.CodeSessionModule = CodeSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([code_session_entity_1.CodeSession])],
        controllers: [code_session_controller_1.CodeSessionController],
        providers: [code_session_service_1.CodeSessionService],
        exports: [code_session_service_1.CodeSessionService],
    })
], CodeSessionModule);
//# sourceMappingURL=code-session.module.js.map