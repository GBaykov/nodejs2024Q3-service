import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

import { isUUID } from 'class-validator';

import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    private dataSource: DataSource,
  ) {}

  private artistsRepository = this.dataSource.getRepository(Artist);

  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.artistsRepository.save({ ...createArtistDto });
    return artist;
  }

  async findAll() {
    return await this.artistsRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException();
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    let artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new NotFoundException();
    }
    artist = { ...artist, ...updateArtistDto };
    await this.artistsRepository.save(artist);
    return artist;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    return Boolean((await this.artistsRepository.delete(id)).affected);
  }
}
