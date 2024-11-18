import { Exclude } from 'class-transformer';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany<Track>(
    (_type) => Track,
    (track: Track): string => track.artistId as string,
    { cascade: true },
  )
  tracks: Track[];

  @OneToMany<Album>(
    (_type) => Album,
    (track: Album): string => track.artistId as string,
    { cascade: true },
  )
  albums: Album[];

  @Exclude()
  favorite: boolean;
}
