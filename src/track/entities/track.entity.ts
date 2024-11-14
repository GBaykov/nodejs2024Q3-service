import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  duration: number; // integer number

  @Column()
  artistId: string | null; // refers to Artist

  @Column()
  albumId: string | null; // refers to Album
}
