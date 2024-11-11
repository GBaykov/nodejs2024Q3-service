import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Fav } from 'src/favs/entities/fav.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

export type DB_Type = {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favs: Fav;
};

export const DB: DB_Type = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favs: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
