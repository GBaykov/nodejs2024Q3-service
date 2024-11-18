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

    // const favs = await DB.favs;
    // const favs = await this.favsRepository.findOne({});

    // for (const key in favs) {
    //   if (favs[key].length > 0) {
    //     for (let i = 0; i < favs.artists.length; i++) {
    //       const artist = await this.artistService.findOne(favs.artists[i]);
    //       resonse.artists.push(artist);
    //     }
    //     for (let i = 0; i < favs.albums.length; i++) {
    //       const album = await this.albumService.findOne(favs.albums[i]);
    //       resonse.albums.push(album);
    //     }
    //     for (let i = 0; i < favs.tracks.length; i++) {
    //       const track = await this.trackService.findOne(favs.tracks[i]);
    //       resonse.tracks.push(track);
    //     }
    //   }
    // }

    return resonse;
  }

  // async findArtist(id: string) {
  //   const favs = await this.favsRepository.findOne({});
  //   // const art = this.favsRepository.find({ select: { artists: true }, where:{artists:{}} });
  //   const artist = favs.artists.find((item) => item === id);
  //   return artist;
  // }

  async createArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    // const favs = await this.favsRepository.findOne({});
    let artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    artist = { ...artist, favorite: true };
    await this.artistsRepository.save(artist);
    return artist;
    // if (!favs.artists.includes(id)) {
    //   await DB.favs.artists.push(id);
    //   return artist;
    // } else {
    //   return;
    // }
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
    // const index = await DB.favs.artists.findIndex(
    //   (artistId) => artistId === id,
    // );
    // if (index === -1) {
    //   throw new NotFoundException();
    // }
    // await DB.favs.artists.splice(index, 1);
  }

  // async findTrack(id: string) {
  //   const track = await DB.favs.tracks.find((item) => item === id);
  //   return track;
  // }

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
    // const track = await DB.tracks.find((item) => item.id === id);
    // if (!track) {
    //   throw new UnprocessableEntityException();
    // }
    // if (!DB.favs.tracks.includes(id)) {
    //   await DB.favs.tracks.push(id);
    //   return track;
    // } else {
    //   return;
    // }
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
    // const index = await DB.favs.tracks.findIndex((trackId) => trackId === id);
    // if (index === -1) {
    //   throw new NotFoundException();
    // }
    // await DB.favs.tracks.splice(index, 1);
  }

  // async findAlbum(id: string) {
  //   const album = await DB.favs.albums.find((item) => item === id);
  //   return album;
  // }

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
    // const album = await DB.albums.find((item) => item.id === id);
    // if (!album) {
    //   throw new UnprocessableEntityException();
    // }
    // if (DB.favs.albums.includes(id)) {
    //   return;
    // } else {
    //   await DB.favs.albums.push(id);
    //   return album;
    // }
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
    // const index = await DB.favs.albums.findIndex((albumId) => albumId === id);
    // if (index === -1) {
    //   throw new NotFoundException();
    // }
    // await DB.favs.albums.splice(index, 1);
  }
}
