import { Exclude } from 'class-transformer';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne((_type) => Artist, { onDelete: 'CASCADE' })
  @JoinTable()
  artistId: string | null;

  @OneToMany<Track>(
    (_type) => Track,
    (track: Track): string => track.albumId as string,
    { cascade: true },
  )
  tracks: Track[];

  @Exclude()
  favorite: boolean;
}
