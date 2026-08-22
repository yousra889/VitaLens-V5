import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, ValidateNested } from 'class-validator';

class GeometryDto {
  @IsIn(['Polygon'])
  type!: 'Polygon';

  @IsArray()
  @ArrayMinSize(1)
  coordinates!: number[][][];
}

export class ZoneQueryDto {
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry!: GeometryDto;
}
