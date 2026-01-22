import { Module } from '@nestjs/common';
import { CodeSession } from './code-session.entity';
import { CodeSessionController } from './code-session.controller';
import { CodeSessionService } from './code-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CodeSession])],
  controllers: [CodeSessionController],
  providers: [CodeSessionService],
  exports: [CodeSessionService],
})
export class CodeSessionModule {}
