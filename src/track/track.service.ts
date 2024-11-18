import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuid } from 'uuid';
import { DB } from 'src/database/db';
import { isUUID } from 'class-validator';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
    private dataSource: DataSource,
  ) {}

  @InjectRepository(Track)
  private tracksRepository = this.dataSource.getRepository(Track);

  async create(createTrackDto: CreateTrackDto) {
    // const track: Track = { ...createTrackDto, id: uuid() };
    return await this.tracksRepository.save({ ...createTrackDto });
  }

  async findAll() {
    // const tracks = await DB.tracks;
    // return tracks;
    return await this.tracksRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    // const track = await DB.tracks.find((track) => track.id === id);
    const track = await this.tracksRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException();
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    // let trackIndex;
    // if (!isUUID(id)) {
    //   throw new BadRequestException();
    // }
    // const track = await DB.tracks.find((track, index) => {
    //   trackIndex = index;
    //   return track.id === id;
    // });
    // if (!track) {
    //   console.log(id);
    //   console.log(track);
    //   console.log(DB.tracks);
    //   throw new NotFoundException();
    // }
    // const newTrack: Track = { ...track, ...updateTrackDto };
    // await DB.tracks.splice(trackIndex, 1, newTrack);
    // return newTrack;
    let track = await this.tracksRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException();
    }
    track = { ...track, ...updateTrackDto };
    await this.tracksRepository.save(track);
    return track;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    // const index = await DB.tracks.findIndex((track) => track.id === id);
    // if (index === -1) {
    //   console.log('index of track not found in remove');
    //   throw new NotFoundException();
    // }
    // await DB.tracks.splice(index, 1);

    // //remove id of track from favs/tracks
    // const trackInFavs = await this.favsService.findTrack(id);
    // if (trackInFavs) {
    //   await this.favsService.removeTrack(id);
    // }

    return Boolean((await this.tracksRepository.delete(id)).affected);
  }

  // async removeArtistId(artistId: string) {
  //   let trackIndex;
  //   if (!isUUID(artistId)) {
  //     throw new BadRequestException();
  //   }
  //   const track = await DB.tracks.find((track, index) => {
  //     trackIndex = index;
  //     return track.artistId === artistId;
  //   });
  //   if (track) {
  //     const newTrack: Track = { ...track, artistId: null };
  //     await DB.tracks.splice(trackIndex, 1, newTrack);
  //   }
  // }

  // async removeAlbumtId(albumId: string) {
  //   let trackIndex;
  //   if (!isUUID(albumId)) {
  //     throw new BadRequestException();
  //   }
  //   const track = await DB.tracks.find((track, index) => {
  //     trackIndex = index;
  //     return track.albumId === albumId;
  //   });
  //   if (track) {
  //     const newTrack: Track = { ...track, albumId: null };
  //     await DB.tracks.splice(trackIndex, 1, newTrack);
  //   }
  // }
}
