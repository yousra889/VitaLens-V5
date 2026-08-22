import { HttpService } from '@nestjs/axios';
import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SqlQueryDto } from './dto/sql-query.dto';

export interface SqlQueryResponseDto {
  rows: Record<string, any>[];
}

@Injectable()
export class SqlService {
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

  async executeSql(dto: SqlQueryDto): Promise<SqlQueryResponseDto> {
    try {
      const response = await firstValueFrom(
        this.http.post<SqlQueryResponseDto>(
          $/sql/query,
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
        geo-service request failed: -30{axiosErr.message},
      );
    }
  }
}
