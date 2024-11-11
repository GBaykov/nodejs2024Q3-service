import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';
import { v4 as uuid } from 'uuid';
import { DB } from 'src/database/db';
import { isUUID } from 'class-validator';
import { Artist } from 'src/artist/entities/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

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

    for (let key in favs) {
      if (favs[key].length > 0) {
        for (let i = 0; i < favs.artists.length; i++) {
          const artist = await this.artistService.findOne(favs.artists[i]);
          // const artist = await DB.artists.find(
          //   (item) => item.id === favs.artists[i],
          // );
          resonse.artists.push(artist);
        }
        for (let i = 0; i < favs.albums.length; i++) {
          const album = await this.albumService.findOne(favs.albums[i]);
          // const album = await DB.albums.find(
          //   (item) => item.id === favs.albums[i],
          // );
          resonse.albums.push(album);
        }
        for (let i = 0; i < favs.tracks.length; i++) {
          const track = await this.trackService.findOne(favs.tracks[i]);
          // const track = await DB.tracks.find(
          //   (item) => item.id === favs.tracks[i],
          // );
          resonse.tracks.push(track);
        }
      }
    }

    return resonse;
  }

  async findOne(id: number) {
    return `This action returns a #${id} fav`;
  }

  async findArtist(id: string) {
    const artist = await DB.favs.artists.find((item) => item === id);
    return artist;
  }

  async createArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    // const artist = await this.artistService.findOne(id);
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    if (DB.favs.artists.find((item) => item === id)) {
      return;
    } else {
      await DB.favs.artists.push(id);
      return artist;
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
    return `Id of Artist #${id} has been removed from favs`;
  }

  async findTrack(id: string) {
    const track = await DB.favs.tracks.find((item) => item === id);
    return track;
  }

  async createTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException();
    }
    if (DB.favs.tracks.find((item) => item === id)) {
      return track;
    } else {
      await DB.favs.tracks.push(id);
      return track;
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
    return `Id of Track #${id} has been removed from favs`;
  }

  async findAlbum(id: string) {
    const album = await DB.favs.albums.find((item) => item === id);
    return album;
  }

  async createAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await this.albumService.findOne(id);
    // const album = await DB.albums.find((item) => item.id === id);
    if (!album) {
      throw new UnprocessableEntityException();
    }
    if (DB.favs.albums.includes(id)) {
      return album;
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
    return `Id of Album #${id} has been removed from favs`;
  }
}
