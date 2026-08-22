import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalDataController } from './medical-data.controller';
import { MedicalDataService } from './medical-data.service';

@Module({
  imports: [HttpModule],
  controllers: [MedicalDataController],
  providers: [MedicalDataService],
})
export class MedicalDataModule {}
