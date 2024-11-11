import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';
import { DB } from 'src/database/db';
import { isUUID } from 'class-validator';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    // if (!createArtistDto.grammy || !createArtistDto.name) {
    //   throw new BadRequestException();
    // }
    const artist: Artist = { ...createArtistDto, id: uuid() };
    await DB.artists.push(artist);
    return artist;
  }

  async findAll() {
    const artists = await DB.artists;
    return artists;
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const artist = await DB.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException();
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    let artistIndex;
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const artist = await DB.artists.find((artist, index) => {
      artistIndex = index;
      return artist.id === id;
    });
    if (!artist) {
      throw new NotFoundException();
    }
    const newArtist: Artist = { ...artist, ...updateArtistDto };
    await DB.artists.splice(artistIndex, 1, newArtist);
    return newArtist;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }
    const index = await DB.artists.findIndex((artist) => artist.id === id);
    console.log(index);
    if (index === -1) {
      console.log('artist not found in delete');
      throw new NotFoundException();
    }
    await DB.artists.splice(index, 1);

    //remove id of artist from favs/artists

    const artistInFavs = await this.favsService.findArtist(id);
    if (artistInFavs) {
      await this.favsService.removeArtist(id);
    }

    //change artistId in Tracks on null
    await this.trackService.removeArtistId(id);

    //change artistId in Albums on null
    await this.albumService.removeArtistId(id);
  }
}
