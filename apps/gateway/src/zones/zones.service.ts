import { HttpService } from '@nestjs/axios';
import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { ZoneQueryDto } from './dto/zone-query.dto';

interface StatisticsResponse {
  total?: number;
  by_source?: Record<string, number>;
  by_type?: Record<string, number>;
}

export interface EstablishmentDto {
  id: string;
  name: string;
  type: string;
  commune?: string;
  province?: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface ZoneQueryResponseDto {
  count: number;
  establishments: EstablishmentDto[];
}

@Injectable()
export class ZonesService {
  private readonly geoServiceUrl: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.geoServiceUrl = config.get<string>(
      'GEO_SERVICE_URL',
      'http://localhost:8000',
    );
  }

  async listAvailable() {
    try {
      const response = await firstValueFrom(
        this.http.get<StatisticsResponse>(
          `${this.geoServiceUrl}/medical-data/statistics`,
        ),
      );

      return {
        status: 'ok',
        ...response.data,
      };
    } catch (err) {
      const axiosErr = err as AxiosError;

      console.error(
        'GEO SERVICE ERROR:',
        axiosErr.response?.data ?? axiosErr.message,
      );

      throw new BadGatewayException(
        `geo-service request failed: ${axiosErr.message}`,
      );
    }
  }

  async queryZone(dto: ZoneQueryDto): Promise<ZoneQueryResponseDto> {
    try {
      const response = await firstValueFrom(
        this.http.post<ZoneQueryResponseDto>(
          `${this.geoServiceUrl}/zones/query`,
          dto,
        ),
      );

      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError;

      console.error(
        'GEO SERVICE ERROR:',
        axiosErr.response?.data ?? axiosErr.message,
      );

      throw new BadGatewayException(
        `geo-service request failed: ${axiosErr.message}`,
      );
    }
  }
}
