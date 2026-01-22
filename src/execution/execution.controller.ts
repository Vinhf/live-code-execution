import { Controller, Get, Param, Post } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { CodeSessionService } from 'src/code-session/code-session.service';

@Controller()
export class ExecutionController {
  constructor(
    private executionService: ExecutionService,
    private sessionService: CodeSessionService,
  ) {}

  @Post('code-sessions/:id/run')
  async run(@Param('id') id: string) {
    const session = await this.sessionService.findById(id);
    if (!session) {
      throw new Error('Code session not found');
    }
    const execution = await this.executionService.run(session);
    return { execution_id: execution.id, status: execution.status };
  }

  @Get('executions/:id')
  async getResult(@Param('id') id: string) {
    return this.executionService.findById(id);
  }
}
