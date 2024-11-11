import {
  BadRequestException,
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
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    const resonse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    const favs = await DB.favs;

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

    return resonse;
  }

  async findOne(id: number) {
    return `This action returns a #${id} fav`;
  }

  // async update(id: number, updateFavDto: UpdateFavDto) {
  //   return `This action updates a #${id} fav`;
  // }

  async createArtist(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    await DB.favs.artists[id];
    return `Id of Artist #${id} has been added to favs`;
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

  async createTrack(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException();
    }
    await DB.favs.tracks[id];
    return `Id of Track #${id} has been added to favs`;
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

  async createAlbum(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException();
    }
    await DB.favs.albums[id];
    return `Id of Album #${id} has been added to favs`;
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
