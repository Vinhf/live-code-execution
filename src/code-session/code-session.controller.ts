import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CodeSessionService } from './code-session.service';
import { UpdateCodeDto } from './dto/update-code.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Code Sessions')
@Controller('code-sessions')
export class CodeSessionController {
  constructor(private readonly service: CodeSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new code session' })
  @ApiResponse({
    status: 201,
    description: 'Session created',
    schema: {
      example: {
        session_id: 'uuid',
        status: 'ACTIVE',
      },
    },
  })
  async create() {
    const session = await this.service.create('python');
    return { session_id: session.id, status: session.status };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Autosave code for a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200 })
  async autosave(@Param('id') id: string, @Body() dto: UpdateCodeDto) {
    await this.service.update(id, dto.sourceCode);
    return { session_id: id, status: 'ACTIVE' };
  }

  @ApiTags('Debug')
  @ApiOperation({ summary: '[DEBUG] Get all code sessions' })
  @ApiResponse({
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
  })
  getAll() {
    return this.service.getAllSessions();
  }
}
