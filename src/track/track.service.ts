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
    return await this.tracksRepository.save({ ...createTrackDto });
  }

  async findAll() {
    return await this.tracksRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    const track = await this.tracksRepository.findOneBy({ id });
    if (!track) {
      throw new NotFoundException();
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
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

    return Boolean((await this.tracksRepository.delete(id)).affected);
  }
}
