// import { OmitType } from '@nestjs/mapped-types';
// import { Artist } from '../entities/artist.entity';

// export class CreateArtistDto extends OmitType(Artist, ['id'] as const) {}
import { IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
