import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeSession } from './code-session.entity';

@Injectable()
export class CodeSessionService {
  constructor(
    @InjectRepository(CodeSession)
    private repo: Repository<CodeSession>,
  ) {}

  create(language: string) {
    return this.repo.save({
      language,
      sourceCode: '',
      status: 'ACTIVE',
    });
  }

  update(id: string, sourceCode: string) {
    return this.repo.update(id, { sourceCode });
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }
}
