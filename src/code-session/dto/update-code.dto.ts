import { ApiProperty } from '@nestjs/swagger';

export class UpdateCodeDto {
  @ApiProperty({ example: 'python' })
  language: string;

  @ApiProperty({ example: "print('Hello World')" })
  sourceCode: string;
}
