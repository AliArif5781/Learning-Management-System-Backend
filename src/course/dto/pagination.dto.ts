import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;
}

// limit: Specifies how many records you want to retrieve. It must be a positive integer.

// offset: Specifies how many records to skip. It should be a non-negative integer (0 or greater).
