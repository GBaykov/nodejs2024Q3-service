import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  artistId: string | null;

  @Exclude()
  favorite: boolean;
}
