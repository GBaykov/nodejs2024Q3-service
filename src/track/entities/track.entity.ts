import { Exclude } from 'class-transformer';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  duration: number; // integer number

  @ManyToOne((_type) => Artist, { onDelete: 'CASCADE' })
  @JoinTable()
  artistId: string | null; // refers to Artist

  @ManyToOne((_type) => Album, { onDelete: 'CASCADE' })
  @JoinTable()
  @Column()
  albumId: string | null; // refers to Album

  @Exclude()
  favorite: boolean;
}
