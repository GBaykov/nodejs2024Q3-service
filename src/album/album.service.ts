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
    if (!createAlbumDto.name || !createAlbumDto.year) {
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
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    return Boolean((await this.albumsRepository.delete(id)).affected);
  }
}
