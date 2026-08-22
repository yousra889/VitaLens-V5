import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MedicalDataService {
  private readonly geoServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.geoServiceUrl =
      this.configService.get<string>('GEO_SERVICE_URL') ??
      'http://geo-service:8000';
  }

  async getMedicalData(limit?: number): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<unknown>(`${this.geoServiceUrl}/medical-data/`, {
          params: limit !== undefined ? { limit } : undefined,
        }),
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new BadGatewayException(
          `Geo-service request failed: ${error.message}`,
        );
      }

      throw new BadGatewayException(
        'Failed to retrieve medical data from geo-service',
      );
    }
  }
}
