import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TrackService } from 'src/track/track.service';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';

@Module({
  // imports: [TrackService, ArtistService, AlbumService],
  controllers: [FavsController],
  providers: [FavsService, ArtistService, AlbumService, TrackService],
})
export class FavsModule {}
