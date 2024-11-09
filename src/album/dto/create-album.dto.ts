import { OmitType } from '@nestjs/mapped-types';
import { Album } from '../entities/album.entity';

export class CreateAlbumDto extends OmitType(Album, ['id'] as const) {}
