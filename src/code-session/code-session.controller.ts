import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CodeSessionService } from './code-session.service';
import { UpdateCodeDto } from './dto/update-code.dto';

@Controller('code-sessions')
export class CodeSessionController {
  constructor(private readonly service: CodeSessionService) {}

  @Post()
  async create() {
    const session = await this.service.create('python');
    return { session_id: session.id, status: session.status };
  }

  @Patch(':id')
  async autosave(@Param('id') id: string, @Body() dto: UpdateCodeDto) {
    await this.service.update(id, dto.sourceCode);
    return { session_id: id, status: 'ACTIVE' };
  }
}
