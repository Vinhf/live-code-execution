import { CodeSession } from 'src/code-session/code-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('executions')
export class Execution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CodeSession)
  @JoinColumn({ name: 'session_id' })
  session: CodeSession;

  @Column()
  status: string;

  @Column('text', { nullable: true })
  stdout: string;

  @Column('text', { nullable: true })
  stderr: string;

  @Column({ nullable: true })
  executionTimeMs: number;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
