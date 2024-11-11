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

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async findAll() {
    const resonse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    const favs = await DB.favs;

    for (const key in favs) {
      if (favs[key].length > 0) {
        for (let i = 0; i < favs.artists.length; i++) {
          const artist = await this.artistService.findOne(favs.artists[i]);
          resonse.artists.push(artist);
        }
        for (let i = 0; i < favs.albums.length; i++) {
          const album = await this.albumService.findOne(favs.albums[i]);
          resonse.albums.push(album);
        }
        for (let i = 0; i < favs.tracks.length; i++) {
          const track = await this.trackService.findOne(favs.tracks[i]);
          resonse.tracks.push(track);
        }
      }
    }

    return resonse;
  }

  async findArtist(id: string) {
    const artist = await DB.favs.artists.find((item) => item === id);
    return artist;
  }

  async createArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const artist = await DB.artists.find((item) => item.id === id);
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    if (!DB.favs.artists.includes(id)) {
      await DB.favs.artists.push(id);
      return artist;
    } else {
      return;
    }
  }

  async removeArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const index = await DB.favs.artists.findIndex(
      (artistId) => artistId === id,
    );
    if (index === -1) {
      throw new NotFoundException();
    }
    await DB.favs.artists.splice(index, 1);
  }

  async findTrack(id: string) {
    const track = await DB.favs.tracks.find((item) => item === id);
    return track;
  }

  async createTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const track = await DB.tracks.find((item) => item.id === id);
    if (!track) {
      throw new UnprocessableEntityException();
    }
    if (!DB.favs.tracks.includes(id)) {
      await DB.favs.tracks.push(id);
      return track;
    } else {
      return;
    }
  }

  async removeTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const index = await DB.favs.tracks.findIndex((trackId) => trackId === id);
    if (index === -1) {
      throw new NotFoundException();
    }
    await DB.favs.tracks.splice(index, 1);
  }

  async findAlbum(id: string) {
    const album = await DB.favs.albums.find((item) => item === id);
    return album;
  }

  async createAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await DB.albums.find((item) => item.id === id);
    if (!album) {
      throw new UnprocessableEntityException();
    }
    if (DB.favs.albums.includes(id)) {
      return;
    } else {
      await DB.favs.albums.push(id);
      return album;
    }
  }

  async removeAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const index = await DB.favs.albums.findIndex((albumId) => albumId === id);
    if (index === -1) {
      throw new NotFoundException();
    }
    await DB.favs.albums.splice(index, 1);
  }
}
