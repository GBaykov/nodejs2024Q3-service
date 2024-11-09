import { OmitType } from '@nestjs/mapped-types';
import { Fav } from '../entities/fav.entity';

export class CreateFavDto extends Fav {}
