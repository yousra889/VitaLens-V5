import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZoneQueryDto } from './dto/zone-query.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  list() {
    return this.zonesService.listAvailable();
  }

  @Post('query')
  query(@Body() dto: ZoneQueryDto) {
    return this.zonesService.queryZone(dto);
  }
}
