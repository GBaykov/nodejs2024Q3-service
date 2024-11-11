import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from 'src/database/db';
import { Album } from './entities/album.entity';
import { isUUID } from 'class-validator';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class AlbumService {
  async create(createAlbumDto: CreateAlbumDto) {
    if (
      !createAlbumDto.artistId ||
      !createAlbumDto.name ||
      !createAlbumDto.year
    ) {
      throw new BadRequestException();
    }
    const album: Album = { ...createAlbumDto, id: uuid() };
    await DB.albums.push(album);
    return album;
  }

  async findAll() {
    const albums = await DB.albums;
    return albums;
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await DB.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException();
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    let albumIndex;
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await DB.albums.find((album, index) => {
      albumIndex = index;
      return album.id === id;
    });
    if (!album) {
      throw new NotFoundException();
    }
    const newAlbum = { ...album, ...updateAlbumDto };
    await DB.albums.splice(albumIndex, 1, newAlbum);
    return newAlbum;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    const index = await DB.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException();
    }
    await DB.albums.splice(index, 1);

    //remove id of this albom from favs/albums
    const indexInFavs = await DB.favs.albums.findIndex((item) => item === id);
    if (indexInFavs !== -1) {
      await DB.favs.albums.splice(indexInFavs, 1);
    }

    //change albumId in Tracks on null
    let trackIndex;
    const track = await DB.tracks.find((track, index) => {
      trackIndex = index;
      return track.albumId === id;
    });
    if (!track) {
      throw new NotFoundException();
    }
    const newTrack: Track = { ...track, albumId: null };
    await DB.tracks.splice(trackIndex, 1, newTrack);
  }
}
