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
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    private dataSource: DataSource,
  ) {}

  @InjectRepository(Album)
  private albumsRepository = this.dataSource.getRepository(Album);

  async create(createAlbumDto: CreateAlbumDto) {
    if (
      // !createAlbumDto.artistId ||
      !createAlbumDto.name ||
      !createAlbumDto.year
    ) {
      throw new BadRequestException();
    }
    const album: Album = await this.albumsRepository.save({
      ...createAlbumDto,
    });
    return album;
  }

  async findAll() {
    return await this.albumsRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const album = await this.albumsRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException();
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    let album = await this.albumsRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException();
    }
    album = { ...album, ...updateAlbumDto };
    await this.albumsRepository.save(album);
    return album;

    // let albumIndex;

    // const album = await DB.albums.find((album, index) => {
    //   albumIndex = index;
    //   return album.id === id;
    // });

    // const newAlbum = { ...album, ...updateAlbumDto };
    // await DB.albums.splice(albumIndex, 1, newAlbum);
    // return newAlbum;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    return Boolean((await this.albumsRepository.delete(id)).affected);
    // const index = await DB.albums.findIndex((album) => album.id === id);
    // if (index === -1) {
    //   console.log('index of album not found in remove');
    //   throw new NotFoundException();
    // }
    // await DB.albums.splice(index, 1);

    // //remove id of this albom from favs/albums
    // const albumInFavs = await this.favsService.findAlbum(id);
    // if (albumInFavs) {
    //   await this.favsService.removeAlbum(id);
    // }

    // //change albumId in Tracks on null
    // await this.trackService.removeAlbumtId(id);
  }

  // async removeArtistId(artistId: string) {
  //   let albumIndex;
  //   if (!isUUID(artistId)) {
  //     throw new BadRequestException();
  //   }
  //   const album = await DB.albums.find((track, index) => {
  //     albumIndex = index;
  //     return track.artistId === artistId;
  //   });
  //   if (album) {
  //     const newAlbum: Album = { ...album, artistId: null };
  //     await DB.albums.splice(albumIndex, 1, newAlbum);
  //   }
  // }
}
