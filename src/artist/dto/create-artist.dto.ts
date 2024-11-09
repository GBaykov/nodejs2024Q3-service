import { OmitType } from '@nestjs/mapped-types';
import { Artist } from '../entities/artist.entity';

export class CreateArtistDto extends OmitType(Artist, ['id'] as const) {}
