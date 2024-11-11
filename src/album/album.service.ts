import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from 'src/database/db';
import { Album } from './entities/album.entity';
import { isUUID } from 'class-validator';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    if (
      // !createAlbumDto.artistId ||
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
      console.log('index of album not found in remove');
      throw new NotFoundException();
    }
    await DB.albums.splice(index, 1);

    //remove id of this albom from favs/albums
    const albumInFavs = await this.favsService.findAlbum(id);
    if (albumInFavs) {
      await this.favsService.removeAlbum(id);
    }

    //change albumId in Tracks on null
    await this.trackService.removeAlbumtId(id);
  }

  async removeArtistId(artistId: string) {
    let albumIndex;
    if (!isUUID(artistId)) {
      throw new BadRequestException();
    }
    const album = await DB.albums.find((track, index) => {
      albumIndex = index;
      return track.artistId === artistId;
    });
    if (album) {
      const newAlbum: Album = { ...album, artistId: null };
      await DB.albums.splice(albumIndex, 1, newAlbum);
    }
  }
}
