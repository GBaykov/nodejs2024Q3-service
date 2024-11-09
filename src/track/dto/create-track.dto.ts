import { OmitType } from '@nestjs/mapped-types';
import { Track } from '../entities/track.entity';

export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}
