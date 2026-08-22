import { Body, Controller, Post } from '@nestjs/common';
import { SqlService } from './sql.service';
import { SqlQueryDto } from './dto/sql-query.dto';

@Controller('sql')
export class SqlController {
  constructor(private readonly sqlService: SqlService) {}

  @Post('query')
  query(@Body() dto: SqlQueryDto) {
    return this.sqlService.executeSql(dto);
  }
}
