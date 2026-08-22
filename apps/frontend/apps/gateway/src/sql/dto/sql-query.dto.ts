import { IsString, MinLength } from 'class-validator';

export class SqlQueryDto {
  @IsString()
  @MinLength(1)
  sql!: string;
}
