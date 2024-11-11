// import { OmitType } from '@nestjs/mapped-types';
// import { Track } from '../entities/track.entity';

// export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}

import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
export class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @IsNumber()
  @Min(0)
  duration: number;
}
