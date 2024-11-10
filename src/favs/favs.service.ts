import { Injectable } from '@nestjs/common';
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
  async create(createFavDto: CreateFavDto) {
    return 'This action adds a new fav';
  }

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

    for (let i = 0; i < favs.artists.length; i++) {
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

  async update(id: number, updateFavDto: UpdateFavDto) {
    return `This action updates a #${id} fav`;
  }

  async remove(id: number) {
    return `This action removes a #${id} fav`;
  }
}
