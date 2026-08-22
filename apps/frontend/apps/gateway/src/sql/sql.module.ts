import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SqlService } from './sql.service';
import { SqlController } from './sql.controller';

@Module({
  imports: [HttpModule],
  providers: [SqlService],
  controllers: [SqlController],
})
export class SqlModule {}
