import { Controller, Get, Query } from '@nestjs/common';
import { MedicalDataService } from './medical-data.service';

@Controller('medical-data')
export class MedicalDataController {
  constructor(private readonly medicalDataService: MedicalDataService) {}

  @Get()
  async getMedicalData(@Query('limit') limit?: string): Promise<unknown> {
    const parsedLimit = limit !== undefined ? Number(limit) : undefined;

    return this.medicalDataService.getMedicalData(parsedLimit);
  }
}
