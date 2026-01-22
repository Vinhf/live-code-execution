import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { CodeSessionService } from '../code-session/code-session.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class ExecutionController {
  constructor(
    private executionService: ExecutionService,
    private sessionService: CodeSessionService,
  ) {}

  @Post('code-sessions/:id/run')
  @ApiTags('Code Sessions')
  @ApiOperation({ summary: 'Run code asynchronously' })
  @ApiResponse({
    status: 201,
    description: 'Execution queued',
    schema: {
      example: {
        execution_id: 'uuid',
        status: 'QUEUED',
      },
    },
  })
  async run(@Param('id') id: string) {
    const session = await this.sessionService.findById(id);
    if (!session) {
      throw new Error('Code session not found');
    }
    const execution = await this.executionService.run(session);
    return { execution_id: execution.id, status: execution.status };
  }

  @Get('executions/:id')
  @ApiTags('Executions')
  @ApiOperation({ summary: 'Get execution result' })
  @ApiParam({ name: 'id', description: 'Execution ID' })
  @ApiResponse({
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
  })
  async getResult(@Param('id') id: string) {
    return this.executionService.findById(id);
  }

  @ApiExcludeEndpoint()
  @Post()
  @ApiTags('Executions')
  enqueue(@Body() body: any) {
    return this.executionService.enqueueExecution(body);
  }

  @ApiTags('Debug')
  @Get('debug/executions')
  @ApiOperation({ summary: '[DEBUG] Get all executions' })
  @ApiResponse({
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
  })
  getAll() {
    return this.executionService.getAllExecutions();
  }

  @ApiTags('Debug')
  @Get('sessions/:id/executions')
  @ApiOperation({ summary: '[DEBUG] Get executions by session ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Executions for a session',
  })
  getExecutionsBySession(@Param('id') sessionId: string) {
    return this.executionService.getExecutionsBySession(sessionId);
  }
}
