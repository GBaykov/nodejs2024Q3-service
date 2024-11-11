import {
  BadRequestException,
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

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.grammy || !createArtistDto.name) {
      throw new BadRequestException();
    }
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
    if (index === -1) {
      throw new NotFoundException();
    }
    await DB.users.splice(index, 1);

    //remove id of artist from favs/artists
    const indexInFavs = await DB.favs.artists.findIndex((item) => item === id);
    if (indexInFavs !== -1) {
      await DB.favs.artists.splice(indexInFavs, 1);
    }

    //change artistId in Tracks on null
    let trackIndex;
    const track = await DB.tracks.find((track, index) => {
      trackIndex = index;
      return track.artistId === id;
    });
    if (!track) {
      throw new NotFoundException();
    }
    const newTrack: Track = { ...track, artistId: null };
    await DB.tracks.splice(trackIndex, 1, newTrack);

    //change artistId in Albums on null
    let albumIndex;
    const album = await DB.albums.find((track, index) => {
      albumIndex = index;
      return album.artistId === id;
    });
    if (!track) {
      throw new NotFoundException();
    }
    const newAlbum: Album = { ...album, artistId: null };
    await DB.albums.splice(albumIndex, 1, newAlbum);
  }
}
