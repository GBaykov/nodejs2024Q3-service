import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { DB } from 'src/database/db';
import { isUUID } from 'class-validator';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Fav } from './entities/fav.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

export type FindAllFavsResp = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    private dataSource: DataSource,
  ) {}

  @InjectRepository(Fav)
  private favsRepository = this.dataSource.getRepository(Fav);
  private artistsRepository = this.dataSource.getRepository(Artist);
  private albumsRepository = this.dataSource.getRepository(Album);
  private tracksRepository = this.dataSource.getRepository(Track);

  async findAll() {
    const resonse: FindAllFavsResp = {
      artists: [],
      albums: [],
      tracks: [],
    };

    resonse.artists = await this.artistsRepository.find({
      where: { favorite: true },
    });
    resonse.albums = await this.albumsRepository.find({
      where: { favorite: true },
    });
    resonse.tracks = await this.tracksRepository.find({
      where: { favorite: true },
    });

    return resonse;
  }

  async createArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    let artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    artist = { ...artist, favorite: true };
    await this.artistsRepository.save(artist);
    return artist;
  }

  async removeArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    let artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    artist = { ...artist, favorite: false };
    await this.artistsRepository.save(artist);
  }

  async createTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    let track = await this.tracksRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException();
    }
    track = { ...track, favorite: true };
    await this.tracksRepository.save(track);
    return track;
  }

  async removeTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    let track = await this.tracksRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException();
    }
    track = { ...track, favorite: false };
    await this.tracksRepository.save(track);
  }

  async createAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    let album = await this.albumsRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException();
    }
    album = { ...album, favorite: true };
    await this.albumsRepository.save(album);
    return album;
  }

  async removeAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    let album = await this.albumsRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException();
    }
    album = { ...album, favorite: false };
    await this.albumsRepository.save(album);
  }
}
