import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

@Module({
  imports: [HttpModule],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}
